const User = require('../models/User');
const Group = require('../models/Group');
const Quiz = require('../models/Quiz');
const CodingRound = require('../models/CodingRound');

// @desc    Get leaderboard for a group
// @route   GET /api/leaderboard/group/:groupId
const getGroupLeaderboard = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId).populate('members', 'name avatar');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Fetch all quizzes and coding rounds for this group
        const quizzes = await Quiz.find({ group: groupId });
        const codingRounds = await CodingRound.find({ group: groupId });

        // Calculate score for each member based on group activities
        const leaderboard = group.members.map(member => {
            let groupScore = 0;

            // functional approach to sum scores
            quizzes.forEach(quiz => {
                const participant = quiz.participants.find(p => p.user.toString() === member._id.toString());
                if (participant) {
                    groupScore += participant.score;
                }
            });

            codingRounds.forEach(round => {
                const participant = round.participants.find(p => p.user.toString() === member._id.toString());
                if (participant) {
                    groupScore += participant.score;
                }
            });

            return {
                _id: member._id,
                name: member.name,
                avatar: member.avatar,
                groupScore
            };
        });

        // Sort by group score
        leaderboard.sort((a, b) => b.groupScore - a.groupScore);

        res.json(leaderboard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getGroupLeaderboard
};
