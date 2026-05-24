const Attempt = require('../models/Attempt');
const OnlineAssessment = require('../models/OnlineAssessment');
const CodingRound = require('../models/CodingRound');

const startOfUtcDay = (date) => {
  const utc = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0, 0, 0, 0,
  ));
  return utc;
};

const toUtcDateKey = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getSoloStreak = async (req, res) => {
  try {
    const userId = req.user._id;

    const [attempts, assessments, rounds] = await Promise.all([
      Attempt.find({ user: userId })
        .select('createdAt')
        .lean(),
      OnlineAssessment.find({ creator: userId, scope: 'solo' })
        .select('participants.sectionSubmissions.submittedAt participants.user')
        .lean(),
      CodingRound.find({ creator: userId, scope: 'solo' })
        .select('participants.user participants.questionStatus.endTime participants.questionStatus.status participants.questionStatus.submittedAt participants.questionStatus.lastStartTime participants.questionStatus.updatedAt')
        .lean(),
    ]);

    const dayCounts = new Map();

    const addEvent = (date) => {
      if (!date) return;
      const key = toUtcDateKey(new Date(date));
      dayCounts.set(key, (dayCounts.get(key) || 0) + 1);
    };

    attempts.forEach((attempt) => addEvent(attempt.createdAt));

    assessments.forEach((oa) => {
      const participant = oa.participants?.find(
        (p) => p.user?.toString() === userId.toString(),
      );
      if (!participant) return;
      participant.sectionSubmissions?.forEach((submission) => {
        addEvent(submission.submittedAt);
      });
    });

    rounds.forEach((round) => {
      const participant = round.participants?.find(
        (p) => p.user?.toString() === userId.toString(),
      );
      if (!participant) return;
      participant.questionStatus?.forEach((status) => {
        if (status?.status === 'Passed') {
          addEvent(status.submittedAt || status.endTime || status.updatedAt || status.lastStartTime);
        }
      });
    });

    const dailyCounts = Array.from(dayCounts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    let streak = 0;
    let cursor = startOfUtcDay(new Date());
    while (true) {
      const key = toUtcDateKey(cursor);
      if (!dayCounts.has(key)) break;
      streak += 1;
      cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
    }

    res.json({
      dailyCounts,
      currentStreak: streak,
    });
  } catch (err) {
    console.error('getSoloStreak error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getSoloStreak,
};
