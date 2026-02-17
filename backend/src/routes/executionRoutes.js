const express = require('express');
const router = express.Router();
const { executeCode, getRuntimes } = require('../controllers/executionController');
const { protect } = require('../middleware/auth'); // Optional: protect execution

// Public or Protected? Execution consumes resources, maybe protect it.
// Given it's a coding platform, users are likely logged in.
router.post('/execute', protect, executeCode);
router.get('/runtimes', getRuntimes);

module.exports = router;
