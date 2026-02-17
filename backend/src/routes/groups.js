const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
    createGroup, 
    joinGroup, 
    getUserGroups, 
    getGroupDetails 
} = require('../controllers/groupController');

router.post('/', protect, createGroup);
router.post('/join', protect, joinGroup);
router.get('/', protect, getUserGroups);
router.get('/:id', protect, getGroupDetails);

module.exports = router;
