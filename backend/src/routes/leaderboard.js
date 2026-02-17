const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getGroupLeaderboard } = require('../controllers/leaderboardController');

router.get('/group/:groupId', protect, getGroupLeaderboard);

module.exports = router;
