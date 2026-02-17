const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
    createQuiz, 
    getQuiz, 
    attemptQuiz 
} = require('../controllers/quizController');

router.post('/generate', protect, createQuiz);
router.get('/:id', protect, getQuiz);
router.post('/:id/attempt', protect, attemptQuiz);

module.exports = router;
