import { useState, useEffect } from 'react';
import axios from '../api/axios';

/* Cycle through accent colors for avatars */
const AVATAR_COLORS = [
    '#f5a623', // orange
    '#9b6dff', // purple
    '#4a90e2', // blue
    '#48bb78', // green
    '#f56565', // red
    '#ed64a6', // pink
    '#38b2ac', // teal
    '#ed8936', // amber
];

const toTitleCase = (str) =>
    str
        ?.toLowerCase()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || '';

const Leaderboard = ({ groupId }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data } = await axios.get(`/api/leaderboard/group/${groupId}`);
                setLeaderboard(data);
            } catch (err) {
                console.error('Failed to fetch leaderboard');
            } finally {
                setLoading(false);
            }
        };
        if (groupId) fetchLeaderboard();
    }, [groupId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-6">
                <div className="w-5 h-5 border-2 border-white/[0.07] border-t-[#7fff6e] rounded-full animate-spin" />
            </div>
        );
    }

    if (leaderboard.length === 0) {
        return (
            <p className="text-[11px] text-[#6b6b80] font-mono text-center py-4">
                No quiz attempts yet.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {leaderboard.map((person, index) => {
                const rank = index + 1;
                const name = toTitleCase(person.name);
                const initial = name.charAt(0);
                const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
                const score = person.groupScore || 0;
                const rowBg = rank === 1
                    ? 'bg-[#211d10] border border-[#ffcc44]/10'
                    : 'bg-[#1a1a24] border border-white/[0.05]';

                return (
                    <div
                        key={person._id}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl ${rowBg}`}
                    >
                        {/* Rank */}
                        <span className="font-['Syne',sans-serif] font-bold text-[15px] text-[#ffcc44] w-8 shrink-0">
                            #{rank}
                        </span>

                        {/* Avatar */}
                        {person.avatar ? (
                            <img
                                src={person.avatar}
                                alt={name}
                                referrerPolicy="no-referrer"
                                className="w-9 h-9 rounded-full flex-shrink-0"
                            />
                        ) : (
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                                style={{ backgroundColor: avatarColor }}
                            >
                                {initial}
                            </div>
                        )}

                        {/* Name */}
                        <span className="flex-1 font-mono text-[13px] text-[#f0f0f5] truncate">
                            {name}
                        </span>

                        {/* Score */}
                        {score > 0 ? (
                            <span className="font-['Syne',sans-serif] font-bold text-[18px] text-[#ffcc44] shrink-0">
                                {score}
                            </span>
                        ) : (
                            <svg className="w-5 h-5 text-[#6b6b80] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle cx="12" cy="12" r="9" strokeWidth={2} />
                            </svg>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Leaderboard;
