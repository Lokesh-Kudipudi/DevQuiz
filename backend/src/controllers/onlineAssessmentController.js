const OnlineAssessment = require('../models/OnlineAssessment');
const WHITELISTED_EMAILS = require('../config/whitelist');
const Group = require('../models/Group');
const { generateOASectionQuestions } = require('../services/geminiService');

// @desc    Create OA — generate questions for all sections and save
// @route   POST /api/online-assessments/generate-and-create
const createOA = async (req, res) => {
    try {
        const { title, groupId, sections } = req.body;

        if (!title || !groupId || !sections || !Array.isArray(sections) || sections.length === 0) {
            return res.status(400).json({ message: 'Title, groupId, and at least one section are required.' });
        }

        // Verify group membership
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });
        if (!group.members.map(m => m.toString()).includes(req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to create OA in this group' });
        }

        // Validate sections
        for (const s of sections) {
            if (!s.name || !s.topics || !s.questionCount || !s.timeLimit) {
                return res.status(400).json({ message: 'Each section must have name, topics, questionCount, and timeLimit.' });
            }
        }

        // Generate questions for all sections in parallel (one Gemini call per section)
        const apiKey = req.headers['x-gemini-api-key'];

        if (!apiKey && !WHITELISTED_EMAILS.includes(req.user.email)) {
             return res.status(400).json({ message: 'API Key required. Please configure your Gemini API Key in Group settings.' });
        }

        const generatedQuestions = await Promise.all(
            sections.map(section => generateOASectionQuestions(section, apiKey))
        );

        const hydratedSections = sections.map((section, i) => ({
            ...section,
            questions: generatedQuestions[i]
        }));

        const oa = await OnlineAssessment.create({
            title,
            group: groupId,
            creator: req.user._id,
            sections: hydratedSections
        });

        // Push ref into Group
        await Group.findByIdAndUpdate(groupId, {
            $push: { onlineAssessments: oa._id }
        });

        res.status(201).json(oa);
    } catch (err) {
        console.error('createOA error:', err);
        res.status(500).json({ message: err.message || 'Failed to create Online Assessment' });
    }
};

// @desc    Get OA details (hides correctAnswer for non-submitted sections)
// @route   GET /api/online-assessments/:id
const getOA = async (req, res) => {
    try {
        const oa = await OnlineAssessment.findById(req.params.id)
            .populate('creator', 'name')
            .populate('group', 'members');

        if (!oa) return res.status(404).json({ message: 'Assessment not found' });

        // Auth check
        if (!oa.group.members.map(m => m.toString()).includes(req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const oaData = oa.toObject();

        // Find participant
        const participant = oa.participants.find(
            p => p.user.toString() === req.user._id.toString()
        );

        // Strip correct answers - only reveal for submitted sections or terminated participant
        const isTerminated = participant && participant.status === 'terminated';
        oaData.sections = oaData.sections.map((section, idx) => {
            const submitted = participant && participant.sectionSubmissions.some(
                ss => ss.sectionIndex === idx
            );
            if (submitted || isTerminated) return section; // reveal
            return {
                ...section,
                questions: section.questions.map(q => ({
                    ...q,
                    correctAnswer: undefined
                }))
            };
        });

        oaData.participant = participant || null;

        res.json(oaData);
    } catch (err) {
        console.error('getOA error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Start OA for a participant (idempotent)
// @route   POST /api/online-assessments/:id/start
const startOA = async (req, res) => {
    try {
        const oa = await OnlineAssessment.findById(req.params.id);
        if (!oa) return res.status(404).json({ message: 'Assessment not found' });

        const existing = oa.participants.find(
            p => p.user.toString() === req.user._id.toString()
        );
        if (existing) {
            return res.json({ message: 'Already started', participant: existing });
        }

        oa.participants.push({
            user: req.user._id,
            startedAt: new Date(),
            status: 'active',
            sectionSubmissions: []
        });

        await oa.save();

        const newParticipant = oa.participants[oa.participants.length - 1];
        res.json({ message: 'Assessment started', participant: newParticipant });
    } catch (err) {
        console.error('startOA error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit a section (locked after submit)
// @route   POST /api/online-assessments/:id/submit-section
const submitSection = async (req, res) => {
    try {
        const { sectionIndex, answers, timeTaken } = req.body;

        const oa = await OnlineAssessment.findById(req.params.id);
        if (!oa) return res.status(404).json({ message: 'Assessment not found' });

        const participant = oa.participants.find(
            p => p.user.toString() === req.user._id.toString()
        );
        if (!participant) return res.status(403).json({ message: 'Not a participant. Start the assessment first.' });
        if (participant.status === 'terminated') return res.status(400).json({ message: 'Assessment has been terminated' });
        if (participant.status === 'completed') return res.status(400).json({ message: 'Assessment already completed' });

        // Check if section already submitted
        const alreadySubmitted = participant.sectionSubmissions.some(
            ss => ss.sectionIndex === sectionIndex
        );
        if (alreadySubmitted) {
            return res.status(400).json({ message: `Section ${sectionIndex + 1} already submitted` });
        }

        const section = oa.sections[sectionIndex];
        if (!section) return res.status(400).json({ message: 'Invalid section index' });

        // Score the section
        let score = 0;
        section.questions.forEach((q, qIdx) => {
            if (answers[qIdx] && answers[qIdx] === q.correctAnswer) score++;
        });

        participant.sectionSubmissions.push({
            sectionIndex,
            answers: answers || [],
            score,
            submittedAt: new Date(),
            timeTaken: timeTaken || 0
        });

        // Auto-complete if all sections submitted
        if (participant.sectionSubmissions.length === oa.sections.length) {
            participant.status = 'completed';
            participant.endedAt = new Date();
        }

        await oa.save();

        res.json({
            message: 'Section submitted',
            score,
            totalSections: oa.sections.length,
            submittedSections: participant.sectionSubmissions.length,
            status: participant.status
        });
    } catch (err) {
        console.error('submitSection error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Terminate assessment for a participant
// @route   PUT /api/online-assessments/:id/end
const endOA = async (req, res) => {
    try {
        const oa = await OnlineAssessment.findById(req.params.id);
        if (!oa) return res.status(404).json({ message: 'Assessment not found' });

        const participant = oa.participants.find(
            p => p.user.toString() === req.user._id.toString()
        );
        if (!participant) return res.status(404).json({ message: 'Participant not found' });

        if (participant.status === 'completed' || participant.status === 'terminated') {
            return res.json({ message: 'Assessment already ended', status: participant.status });
        }

        participant.status = 'terminated';
        participant.endedAt = new Date();

        await oa.save();

        res.json({ message: 'Assessment terminated', status: 'terminated' });
    } catch (err) {
        console.error('endOA error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get results (full data with leaderboard)
// @route   GET /api/online-assessments/:id/results
const getOAResults = async (req, res) => {
    try {
        const oa = await OnlineAssessment.findById(req.params.id)
            .populate('creator', 'name')
            .populate('group', 'members')
            .populate('participants.user', 'name avatar');

        if (!oa) return res.status(404).json({ message: 'Assessment not found' });

        if (!oa.group.members.map(m => m.toString()).includes(req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const oaData = oa.toObject();

        // Build leaderboard: all participants ranked by total score
        const leaderboard = oaData.participants
            .filter(p => p.sectionSubmissions && p.sectionSubmissions.length > 0)
            .map(p => {
                const totalScore = p.sectionSubmissions.reduce((sum, ss) => sum + (ss.score || 0), 0);
                const maxPossible = oaData.sections.reduce((sum, s) => sum + (s.questionCount || 0), 0);
                return {
                    user: p.user,
                    status: p.status,
                    totalScore,
                    maxPossible,
                    sectionBreakdown: p.sectionSubmissions.map(ss => ({
                        sectionIndex: ss.sectionIndex,
                        sectionName: oaData.sections[ss.sectionIndex]?.name || `Section ${ss.sectionIndex + 1}`,
                        score: ss.score,
                        maxScore: oaData.sections[ss.sectionIndex]?.questionCount || 0,
                        timeTaken: ss.timeTaken
                    }))
                };
            })
            .sort((a, b) => b.totalScore - a.totalScore);

        oaData.leaderboard = leaderboard;

        // Find MY participant record
        const myParticipant = oaData.participants.find(
            p => (p.user._id || p.user).toString() === req.user._id.toString()
        );
        oaData.myParticipant = myParticipant || null;

        res.json(oaData);
    } catch (err) {
        console.error('getOAResults error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete OA (creator or group creator)
// @route   DELETE /api/online-assessments/:id
const deleteOA = async (req, res) => {
    try {
        const oa = await OnlineAssessment.findById(req.params.id);
        if (!oa) return res.status(404).json({ message: 'Assessment not found' });

        const group = await Group.findById(oa.group);
        const isOACreator = oa.creator.toString() === req.user._id.toString();
        const isGroupCreator = group && group.creator.toString() === req.user._id.toString();

        if (!isOACreator && !isGroupCreator) {
            return res.status(403).json({ message: 'Not authorized to delete this assessment' });
        }

        await OnlineAssessment.findByIdAndDelete(req.params.id);

        // Remove ref from Group
        await Group.findByIdAndUpdate(oa.group, {
            $pull: { onlineAssessments: oa._id }
        });

        res.json({ message: 'Assessment deleted successfully' });
    } catch (err) {
        console.error('deleteOA error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createOA,
    getOA,
    startOA,
    submitSection,
    endOA,
    getOAResults,
    deleteOA
};
