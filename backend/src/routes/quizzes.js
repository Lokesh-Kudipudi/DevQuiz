const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
    createQuiz, 
    getQuiz, 
    attemptQuiz,
    getQuizResults
} = require('../controllers/quizController');

router.post('/generate', protect, createQuiz);
router.get('/:id', protect, getQuiz);
router.post('/:id/attempt', protect, attemptQuiz);
router.get('/:id/results', protect, getQuizResults);

module.exports = router;
