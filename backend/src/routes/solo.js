const express = require('express');
const router = express.Router();
const { protect, checkNotDemo } = require('../middleware/auth');
const {
  createSoloQuiz,
  getSoloQuizzes,
} = require('../controllers/quizController');
const {
  createSoloOA,
  getSoloOAs,
} = require('../controllers/onlineAssessmentController');
const {
  createSoloCodingRound,
  getSoloCodingRounds,
} = require('../controllers/codingRoundController');
const { getSoloStreak } = require('../controllers/soloController');

router.get('/streak', protect, getSoloStreak);

router.post('/quizzes/generate', protect, checkNotDemo, createSoloQuiz);
router.get('/quizzes', protect, getSoloQuizzes);

router.post('/online-assessments/generate-and-create', protect, checkNotDemo, createSoloOA);
router.get('/online-assessments', protect, getSoloOAs);

router.post('/coding-rounds', protect, checkNotDemo, createSoloCodingRound);
router.get('/coding-rounds', protect, getSoloCodingRounds);

module.exports = router;
