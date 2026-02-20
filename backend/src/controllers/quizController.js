const Quiz = require('../models/Quiz');
const WHITELISTED_EMAILS = require('../config/whitelist');
const Group = require('../models/Group');
const Attempt = require('../models/Attempt');
const User = require('../models/User');
const { generateQuizQuestions } = require('../services/geminiService');

// @desc    Generate and create a new quiz
// @route   POST /api/quizzes/generate
const createQuiz = async (req, res) => {
    try {
        const { topic, difficulty, count, groupId } = req.body;

        // Verify group membership
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (!group.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to create quiz in this group' });
        }

        // Generate questions using Gemini
        const apiKey = req.headers['x-gemini-api-key'];
        
        if (!apiKey && !WHITELISTED_EMAILS.includes(req.user.email)) {
             return res.status(400).json({ message: 'API Key required. Please configure your Gemini API Key in Group settings.' });
        }

        const questions = await generateQuizQuestions(topic, difficulty, count, apiKey);

        // Create Quiz
        const quiz = await Quiz.create({
            title: `${topic} Quiz (${difficulty})`,
            topic,
            difficulty,
            creator: req.user._id,
            group: groupId,
            questions
        });

        // Add quiz to group
        group.quizzes.push(quiz._id);
        await group.save();

        res.status(201).json(quiz);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to generate quiz' });
    }
};

// @desc    Get quiz details
// @route   GET /api/quizzes/:id
const getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate('group', 'members'); // To check if user is member

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if user is member of the group
        if (!quiz.group.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to view this quiz' });
        }

        // Check for existing attempt
        const attempt = await Attempt.findOne({ quiz: quiz._id, user: req.user._id });

        const quizData = quiz.toObject();
        if (attempt) {
            quizData.attempt = attempt;
        }

        res.json(quizData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/attempt
const attemptQuiz = async (req, res) => {
    try {
        const { answers } = req.body; // Array of { questionIndex, selectedOption }
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let score = 0;
        const processedAnswers = answers.map(ans => {
            const question = quiz.questions[ans.questionIndex];
            const isCorrect = question.correctAnswer === ans.selectedOption;
            if (isCorrect) score++;
            return { ...ans, isCorrect };
        });

        // Save Attempt
        await Attempt.create({
            quiz: quiz._id,
            user: req.user._id,
            score,
            answers: processedAnswers
        });

        // Update Quiz participants
        // Check if user already attempted, if so update score (or keep best?) - prompt says "store result", implies simple push
        // But prompt says "participants[] -> userId, score".
        // Let's just push. If multiple attempts allowed, it will show multiple entries or we can filter.
        // For simplicity, we just push a new entry.
        
        quiz.participants.push({
            user: req.user._id,
            score,
            attemptedAt: new Date()
        });
        await quiz.save();

        // Update User total score
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { totalScore: score }
        });

        res.json({ score, total: quiz.questions.length, processedAnswers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get quiz results (participants and scores)
// @route   GET /api/quizzes/:id/results
const getQuizResults = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate('group', 'members')
            .populate('participants.user', 'name email');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if user is member of the group
        if (!quiz.group.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to view these results' });
        }

        // Return participants sorted by score (descending)
        const results = quiz.participants.sort((a, b) => b.score - a.score);

        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const group = await Group.findById(quiz.group);
        
        // Check if user is the creator of the quiz OR the creator of the group
        const isQuizCreator = quiz.creator.toString() === req.user._id.toString();
        const isGroupAdmin = group && group.creator.toString() === req.user._id.toString();

        if (!isQuizCreator && !isGroupAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this quiz' });
        }

        // Revert user scores
        const attempts = await Attempt.find({ quiz: quiz._id });
        for (const attempt of attempts) {
            await User.findByIdAndUpdate(attempt.user, {
                $inc: { totalScore: -attempt.score }
            });
        }

        // Delete associated attempts
        await Attempt.deleteMany({ quiz: quiz._id });

        // Remove quiz from group
        if (group) {
            group.quizzes = group.quizzes.filter(qId => qId.toString() !== quiz._id.toString());
            await group.save();
        }

        await Quiz.findByIdAndDelete(req.params.id);

        res.json({ message: 'Quiz removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createQuiz,
    getQuiz,
    attemptQuiz,
    getQuizResults,
    deleteQuiz
};

