const express = require('express');
const router = express.Router();
const { 
    createCodingRound, 
    getCodingRound, 
    joinCodingRound, 
    submitSolution,
    generateQuestions,
    deleteCodingRound
} = require('../controllers/codingRoundController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateQuestions);
router.post('/', protect, createCodingRound);
router.get('/:id', protect, getCodingRound);
router.delete('/:id', protect, deleteCodingRound);
router.post('/:id/join', protect, joinCodingRound);
router.post('/:id/submit', protect, submitSolution);

module.exports = router;
