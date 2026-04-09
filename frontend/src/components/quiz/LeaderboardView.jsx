import { useAuth } from '../../context/AuthContext';
import {
  LB_TABLE_HEADER_STYLES,
  LB_TABLE_ROW_STYLES,
  LB_TABLE_ROW_ME_STYLES,
  RANK_BADGE,
} from '../../constants/ui';

const LeaderboardView = ({ results }) => {
    const { user } = useAuth();

    if (results.length === 0) {
        return (
            <div className="py-12 px-6 text-center bg-[var(--color-surface)] border border-dashed border-[var(--color-text-base)]/[0.07] rounded-[12px]">
                <div className="text-3xl mb-3 opacity-40">🏆</div>
                <p className="font-['Syne',sans-serif] font-semibold text-[var(--color-text-base)] text-sm mb-2">No attempts yet</p>
                <p className="text-xs text-[var(--color-muted)] font-mono">Be the first to take this quiz!</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header row */}
            <div className={LB_TABLE_HEADER_STYLES}>
                <div>Rank</div>
                <div>Participant</div>
                <div className="text-right">Score</div>
                <div className="text-right">Date</div>
            </div>

            {/* Data rows */}
            {results.map((result, index) => {
                const isMe = result.user?._id === user?._id;
                const rowClass = isMe ? LB_TABLE_ROW_ME_STYLES : LB_TABLE_ROW_STYLES;
                const rank = index + 1;
                const badgeClass = RANK_BADGE[rank] || RANK_BADGE.default;

                return (
                    <div key={index} className={rowClass}>
                        {/* Rank */}
                        <div>
                            <div className={badgeClass}>{rank}</div>
                        </div>

                        {/* Participant */}
                        <div className="flex items-center gap-2.5">
                            {result.user?.avatar ? (
                                <img
                                    src={result.user.avatar}
                                    alt={result.user.name}
                                    referrerPolicy="no-referrer"
                                    className="w-8 h-8 rounded-full flex-shrink-0"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-[#9b6dff] flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0">
                                    {result.user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                            )}
                            <span className="text-xs font-mono text-[var(--color-text-base)]">
                                {result.user?.name || 'Unknown'}
                                {isMe && <span className="ml-1.5 text-[10px] text-[#7fff6e]">(you)</span>}
                            </span>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                            <span className="font-['Syne',sans-serif] font-bold text-base text-[#ffcc44]">
                                {result.score}
                            </span>
                            <span className="text-[10px] text-[var(--color-muted)] font-mono ml-1">pts</span>
                        </div>

                        {/* Date */}
                        <div className="text-right text-[11px] text-[var(--color-muted)] font-mono">
                            {new Date(result.attemptedAt).toLocaleDateString()}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LeaderboardView;
