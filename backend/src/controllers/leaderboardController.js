const User = require('../models/User');
const Group = require('../models/Group');

// @desc    Get leaderboard for a group
// @route   GET /api/leaderboard/group/:groupId
const getGroupLeaderboard = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId).populate('members', 'name avatar totalScore');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Sort members by total score
        const leaderboard = group.members.sort((a, b) => b.totalScore - a.totalScore);

        res.json(leaderboard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getGroupLeaderboard
};
