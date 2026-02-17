const CodingRound = require('../models/CodingRound');
const Group = require('../models/Group');
const User = require('../models/User');
const { generateCodingQuestions } = require('../services/geminiService');

// @desc    Create a new coding round
// @route   POST /api/coding-rounds
const createCodingRound = async (req, res) => {
    try {
        const { title, groupId, timeLimit, questions } = req.body;

        // Verify group membership
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (!group.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to create coding round in this group' });
        }

        const codingRound = await CodingRound.create({
            title,
            group: groupId,
            creator: req.user._id,
            timeLimit,
            questions
        });

        // Add to group's quizzes (or separate field if we modify Group model, for now let's just create it)
        // Note: The Group model might expect 'quizzes' to be ObjectIds of 'Quiz' model. 
        // If 'quizzes' field in Group is strict ref to 'Quiz', this might fail or be inconsistent.
        // For now, we'll assume we can just query CodingRounds by groupId.

        res.status(201).json(codingRound);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create coding round' });
    }
};

// @desc    Get coding round details
// @route   GET /api/coding-rounds/:id
const getCodingRound = async (req, res) => {
    try {
        const round = await CodingRound.findById(req.params.id)
            .populate('group', 'members');

        if (!round) {
            return res.status(404).json({ message: 'Coding round not found' });
        }

        // Check auth
        if (!round.group.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to access this round' });
        }

        const participant = round.participants.find(p => p.user.toString() === req.user._id.toString());
        
        // Hide hidden test cases from client
        const roundData = round.toObject();
        roundData.questions.forEach(q => {
            q.testCases = q.testCases.filter(tc => !tc.isHidden);
        });

        if (participant) {
            roundData.participant = participant;
        }

        res.json(roundData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Join coding round (start timer)
// @route   POST /api/coding-rounds/:id/join
const joinCodingRound = async (req, res) => {
    try {
        const round = await CodingRound.findById(req.params.id);
        if (!round) return res.status(404).json({ message: 'Round not found' });

        const existingParticipant = round.participants.find(p => p.user.toString() === req.user._id.toString());
        
        if (existingParticipant) {
            return res.json({ message: 'Already joined', startTime: existingParticipant.startTime });
        }

        const newParticipant = {
            user: req.user._id,
            startTime: new Date(),
            score: 0,
            questionStatus: round.questions.map(q => ({
                questionId: q._id,
                status: 'Pending'
            }))
        };

        round.participants.push(newParticipant);
        await round.save();

        // Emit socket event for leaderboard update
        const io = req.app.get('socketio');
        if (io) {
            io.to(`round_${round._id}`).emit('leaderboard_update', {
                leaderboard: round.participants.sort((a, b) => b.score - a.score)
            });
        }

        res.json({ message: 'Joined successfully', startTime: newParticipant.startTime });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit solution for a question
// @route   POST /api/coding-rounds/:id/submit
const submitSolution = async (req, res) => {
    try {
        const { questionId, code, passed } = req.body; 
        // Note: 'passed' boolean comes from frontend after running against hidden test cases? 
        // ideally backend runs it, but for now we trust frontend result mixed with Piston
        
        const round = await CodingRound.findById(req.params.id);
        if (!round) return res.status(404).json({ message: 'Round not found' });

        const participant = round.participants.find(p => p.user.toString() === req.user._id.toString());
        if (!participant) return res.status(403).json({ message: 'Not a participant' });

        const questionStatus = participant.questionStatus.find(qs => qs.questionId.toString() === questionId);
        
        if (questionStatus) {
            questionStatus.code = code;
            if (passed && questionStatus.status !== 'Passed') {
                questionStatus.status = 'Passed';
                participant.score += 10; // +10 points for solving
            } else if (!passed) {
                 questionStatus.status = 'Failed';
            }
        }

        await round.save();

        // Emit socket event
        const io = req.app.get('socketio');
        if (io) {
            // Populate user details for leaderboard
            await round.populate('participants.user', 'name');
            io.to(`round_${round._id}`).emit('leaderboard_update', {
                leaderboard: round.participants
                    .map(p => ({
                        user: p.user,
                        score: p.score,
                        status: p.questionStatus
                    }))
                    .sort((a, b) => b.score - a.score)
            });
        }

        res.json({ message: 'Submission recorded', score: participant.score });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete coding round
// @route   DELETE /api/coding-rounds/:id
const deleteCodingRound = async (req, res) => {
    try {
        const round = await CodingRound.findById(req.params.id);
        if (!round) {
            return res.status(404).json({ message: 'Coding round not found' });
        }

        // Check if user is creator or group admin
        // We need to fetch the group to check admin status if needed
        const group = await Group.findById(round.group);
        
        // Authorization: Creator of round OR Creator of group
        if (round.creator.toString() !== req.user._id.toString() && 
            (group && group.creator.toString() !== req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to delete this round' });
        }

        await CodingRound.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coding round deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Generate coding questions using AI
// @route   POST /api/coding-rounds/generate
const generateQuestions = async (req, res) => {
    try {
        const { topic, difficulty, count } = req.body;
        
        if (!topic || !difficulty || !count) {
            return res.status(400).json({ message: 'Please provide topic, difficulty, and count' });
        }

        const questions = await generateCodingQuestions(topic, difficulty, count);
        res.json(questions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to generate questions' });
    }
};

module.exports = {
    createCodingRound,
    getCodingRound,
    joinCodingRound,
    submitSolution,
    generateQuestions,
    deleteCodingRound
};
