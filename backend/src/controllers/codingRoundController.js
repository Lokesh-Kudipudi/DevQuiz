const CodingRound = require('../models/CodingRound');
const Group = require('../models/Group');
const User = require('../models/User');
const { generateCodingQuestions } = require('../services/geminiService');

// @desc    Create a new coding round
// @route   POST /api/coding-rounds
const createCodingRound = async (req, res) => {
    try {
        const { title, groupId, timeLimit, questions, type, allowSelfAttempt } = req.body;

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
            questions: questions || [], // Can be empty for External rounds initially
            type: type || 'Piston',
            allowSelfAttempt: allowSelfAttempt || false
        });

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
            .populate('group', 'members')
            .populate('questions.addedBy', 'name')
            .populate('creator', 'name')
            .populate('participants.user', 'name');

        if (!round) {
            return res.status(404).json({ message: 'Coding round not found' });
        }

        // Check auth
        if (!round.group.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to access this round' });
        }

        const participant = round.participants.find(p => 
            (p.user._id || p.user).toString() === req.user._id.toString()
        );
        
        const roundData = round.toObject();

        if (round.type === 'Piston') {
            // Hide hidden test cases from client for Piston rounds
            roundData.questions.forEach(q => {
                if (q.testCases) {
                    q.testCases = q.testCases.filter(tc => !tc.isHidden);
                }
            });
        } else if (round.type === 'External') {
            // For External rounds, visibility depends on status
            if (round.status === 'Pending') {
                // Show skeleton unless the user added the question
                roundData.questions = roundData.questions.map(q => {
                    const isAddedByMe = q.addedBy && q.addedBy._id.toString() === req.user._id.toString();

                    if (isAddedByMe) {
                        return q;
                    }

                    return {
                        _id: q._id,
                        addedBy: q.addedBy,
                        title: 'Hidden Question',
                        difficulty: q.difficulty,
                        points: q.points,
                        platform: q.platform,
                        isSkeleton: true
                    };
                });
            }
            // If Live or Completed, show all details
        }

        if (participant) {
            roundData.participant = participant;
        }

        res.json(roundData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add question to round (External only)
// @route   POST /api/coding-rounds/:id/questions
const addQuestionToRound = async (req, res) => {
    try {
        const { title, url, platform, difficulty, points } = req.body;
        const round = await CodingRound.findById(req.params.id);
        
        if (!round) return res.status(404).json({ message: 'Round not found' });
        
        // Check if round is pending
        if (round.status !== 'Pending') {
            return res.status(400).json({ message: 'Cannot add questions to a live or completed round' });
        }

        // Add question
        round.questions.push({
            title,
            url,
            platform,
            difficulty,
            points,
            addedBy: req.user._id
        });

        await round.save();
        
        // Emit socket event to update lobby
        const io = req.app.get('socketio');
        if (io) {
            await round.populate('questions.addedBy', 'name');
            io.to(`round_${round._id}`).emit('question_added', { 
                questions: round.questions 
            });
        }

        res.json(round.questions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Start the round (Creator only)
// @route   POST /api/coding-rounds/:id/start
const startRound = async (req, res) => {
    try {
        const round = await CodingRound.findById(req.params.id);
        if (!round) return res.status(404).json({ message: 'Round not found' });

        if (round.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only creator can start the round' });
        }

        if (round.status !== 'Pending') {
            return res.status(400).json({ message: 'Round already started or completed' });
        }

        round.status = 'Live';
        round.startTime = new Date();
        // Calculate endTime
        round.endTime = new Date(round.startTime.getTime() + round.timeLimit * 60000);

        await round.save();

        // Emit socket event
        const io = req.app.get('socketio');
        if (io) {
            io.to(`round_${round._id}`).emit('round_started', { 
                startTime: round.startTime,
                endTime: round.endTime
            });
        }

        res.json({ message: 'Round started', startTime: round.startTime });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Join coding round
// @route   POST /api/coding-rounds/:id/join
const joinCodingRound = async (req, res) => {
    try {
        const round = await CodingRound.findById(req.params.id);
        if (!round) return res.status(404).json({ message: 'Round not found' });

        // Prepare new participant object
        const newParticipant = {
            user: req.user._id,
            startTime: new Date(),
            score: 0,
            questionStatus: round.questions.map(q => ({
                questionId: q._id,
                status: 'Pending'
            }))
        };

        // Atomically add participant ONLY if not already in list
        const updatedRound = await CodingRound.findOneAndUpdate(
            { 
                _id: req.params.id, 
                'participants.user': { $ne: req.user._id } 
            },
            {
                $push: { participants: newParticipant }
            },
            { new: true }
        ).populate('participants.user', 'name');

        if (!updatedRound) {
            // User already exists or round deleted (but we checked existence above)
            // Fetch current state to return existing participant
            const currentRound = await CodingRound.findById(req.params.id);
            if (!currentRound) return res.status(404).json({ message: 'Round not found' });
            
            const existingParticipant = currentRound.participants.find(p => 
                (p.user._id || p.user).toString() === req.user._id.toString()
            );
            return res.json({ message: 'Already joined', participant: existingParticipant });
        }

        // Emit socket event for leaderboard update
        const io = req.app.get('socketio');
        if (io) {
            // We already populated user in findOneAndUpdate options? 
            // Actually findOneAndUpdate returns the doc, but populate might need explicit call or options.
            // The .populate() chained above works on the query result.
            
             io.to(`round_${round._id}`).emit('leaderboard_update', {
                leaderboard: updatedRound.participants.map(p => ({
                    user: p.user,
                    score: p.score,
                    status: p.questionStatus
                })).sort((a, b) => b.score - a.score)
            });
        }

        res.json({ message: 'Joined successfully', participant: newParticipant });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Start timer for a specific question (External)
// @route   PUT /api/coding-rounds/:id/questions/:questionId/start
const startQuestionTimer = async (req, res) => {
    try {
        const round = await CodingRound.findById(req.params.id);
        if (!round) return res.status(404).json({ message: 'Round not found' });
        
        const participant = round.participants.find(p => p.user.toString() === req.user._id.toString());
        if (!participant) return res.status(403).json({ message: 'Not a participant' });

        if (!participant.questionStatus) participant.questionStatus = [];

        // Check if self attempt allowed
        const question = round.questions.id(req.params.questionId);
        if (question.addedBy && question.addedBy.toString() === req.user._id.toString() && !round.allowSelfAttempt) {
             return res.status(403).json({ message: 'Self attempt not allowed for this round' });
        }

        const questionStatus = participant.questionStatus.find(qs => qs.questionId.toString() === req.params.questionId);
        
        if (questionStatus) {
            if (questionStatus.status === 'Pending') {
                questionStatus.status = 'Solving';
                questionStatus.startTime = new Date();
                questionStatus.lastStartTime = new Date();
                await round.save();
            } else if (questionStatus.status === 'Solving' && !questionStatus.lastStartTime) {
                // Resume logic
                questionStatus.lastStartTime = new Date();
                await round.save();
            }
            res.json(questionStatus);
        } else {
             // Should not happen if joined correctly, but can maintain robustness
             participant.questionStatus.push({
                 questionId: req.params.questionId,
                 status: 'Solving',
                 startTime: new Date(),
                 lastStartTime: new Date()
             });
             await round.save();
             res.json(participant.questionStatus[participant.questionStatus.length-1]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Pause timer for a specific question (External)
// @route   PUT /api/coding-rounds/:id/questions/:questionId/pause
const pauseQuestionTimer = async (req, res) => {
    try {
        const round = await CodingRound.findById(req.params.id);
        if (!round) return res.status(404).json({ message: 'Round not found' });
        
        const participant = round.participants.find(p => p.user.toString() === req.user._id.toString());
        if (!participant) return res.status(403).json({ message: 'Not a participant' });

        if (!participant.questionStatus) participant.questionStatus = [];

        const questionStatus = participant.questionStatus.find(qs => qs.questionId.toString() === req.params.questionId);
        
        if (questionStatus && questionStatus.status === 'Solving' && questionStatus.lastStartTime) {
            const now = new Date();
            const sessionDuration = (now - questionStatus.lastStartTime) / 1000;
            questionStatus.accumulatedTime = (questionStatus.accumulatedTime || 0) + sessionDuration;
            questionStatus.lastStartTime = null; // Paused
            
            await round.save();
            res.json(questionStatus);
        } else {
            res.status(400).json({ message: 'Question not running or not in solving state' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit solution (External) - Stop Timer
// @route   POST /api/coding-rounds/:id/submit-external
const submitExternalQuestion = async (req, res) => {
     try {
        const { questionId } = req.body;
        const round = await CodingRound.findById(req.params.id);
        if (!round) return res.status(404).json({ message: 'Round not found' });

        const participant = round.participants.find(p => p.user.toString() === req.user._id.toString());
        if (!participant) return res.status(403).json({ message: 'Not a participant' });

        if (!participant.questionStatus) participant.questionStatus = [];

        const questionStatus = participant.questionStatus.find(qs => qs.questionId.toString() === questionId);
        const question = round.questions.id(questionId);

        if (questionStatus && questionStatus.status === 'Solving') {
            questionStatus.status = 'Passed'; // Assumed passed for external
            questionStatus.endTime = new Date();
            
            // Calculate total time
            let currentSessionTime = 0;
            if (questionStatus.lastStartTime) {
                 currentSessionTime = (questionStatus.endTime - questionStatus.lastStartTime) / 1000;
            }
            const totalDuration = (questionStatus.accumulatedTime || 0) + currentSessionTime;
            
            questionStatus.timeTaken = totalDuration;
            questionStatus.lastStartTime = null; // Clear active session

            // Update score
            participant.score += question.points || 0;

            await round.save();

            // Emit socket event
            const io = req.app.get('socketio');
            if (io) {
                await round.populate('participants.user', 'name');
                io.to(`round_${round._id}`).emit('leaderboard_update', {
                    leaderboard: round.participants.map(p => ({
                        user: p.user,
                        score: p.score,
                        status: p.questionStatus
                    })).sort((a, b) => b.score - a.score)
                });
            }

            res.json({ message: 'Submitted', score: participant.score, timeTaken: totalDuration });
        } else {
            res.status(400).json({ message: 'Question not in solving state or already submitted' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Submit solution for a question (Piston)
// @route   POST /api/coding-rounds/:id/submit
const submitSolution = async (req, res) => {
    try {
        const { questionId, code, passed } = req.body; 
        
        const round = await CodingRound.findById(req.params.id);
        if (!round) return res.status(404).json({ message: 'Round not found' });

        const participant = round.participants.find(p => p.user.toString() === req.user._id.toString());
        if (!participant) return res.status(403).json({ message: 'Not a participant' });

        const questionStatus = participant.questionStatus.find(qs => qs.questionId.toString() === questionId);
        
        if (questionStatus) {
            questionStatus.code = code;
            
            // Calculate time taken if not already passed
            if (questionStatus.status !== 'Passed') {
                const now = new Date();
                const startTime = participant.startTime || round.startTime || now;
                const timeTaken = (now - new Date(startTime)) / 1000; // in seconds
                questionStatus.timeTaken = timeTaken;
            }

            if (passed && questionStatus.status !== 'Passed') {
                questionStatus.status = 'Passed';
                participant.score += 10; // +10 points for solving Piston
            } else if (!passed) {
                 questionStatus.status = 'Failed';
            }
        }

        await round.save();

        // Emit socket event
        const io = req.app.get('socketio');
        if (io) {
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

// @desc    End coding round (Creator only)
// @route   PUT /api/coding-rounds/:id/end
const endCodingRound = async (req, res) => {
    try {
        const round = await CodingRound.findById(req.params.id);
        if (!round) return res.status(404).json({ message: 'Round not found' });

        if (round.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only creator can end the round' });
        }

        round.status = 'Completed';
        round.endTime = new Date();
        await round.save();

        const io = req.app.get('socketio');
        if (io) {
            io.to(`round_${round._id}`).emit('round_ended');
        }

        res.json({ message: 'Round ended successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createCodingRound,
    getCodingRound,
    joinCodingRound,
    submitSolution,
    generateQuestions,
    deleteCodingRound,
    addQuestionToRound,
    startRound,
    startQuestionTimer,
    pauseQuestionTimer,
    submitExternalQuestion,
    endCodingRound
};
