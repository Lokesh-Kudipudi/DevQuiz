const Group = require('../models/Group');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// @desc    Create a new group
// @route   POST /api/groups
const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Generate a short invite code (first 6 chars of uuid)
        const inviteCode = uuidv4().substring(0, 6).toUpperCase();

        const group = await Group.create({
            name,
            description,
            inviteCode,
            creator: req.user._id,
            members: [req.user._id] // Creator is automatically a member
        });

        // Add group to user's createdGroups and joinedGroups
        await User.findByIdAndUpdate(req.user._id, {
            $push: { createdGroups: group._id, joinedGroups: group._id }
        });

        res.status(201).json(group);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Join a group via invite code
// @route   POST /api/groups/join
const joinGroup = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        
        const group = await Group.findOne({ inviteCode });
        if (!group) {
            return res.status(404).json({ message: 'Invalid invite code' });
        }

        // Check if already a member
        if (group.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already a member of this group' });
        }

        // Add user to group members
        group.members.push(req.user._id);
        await group.save();

        // Add group to user's joinedGroups
        await User.findByIdAndUpdate(req.user._id, {
            $push: { joinedGroups: group._id }
        });

        res.json(group);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's groups
// @route   GET /api/groups
const getUserGroups = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('joinedGroups');
        res.json(user.joinedGroups);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single group details
// @route   GET /api/groups/:id
const getGroupDetails = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('members', 'name avatar email')
            .populate('quizzes')
            .populate('creator', 'name');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        
        // Check if user is member
        if(!group.members.some(member => member._id.toString() === req.user._id.toString())){
             return res.status(403).json({ message: 'Not authorized to view this group' });
        }

        res.json(group);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createGroup,
    joinGroup,
    getUserGroups,
    getGroupDetails
};
