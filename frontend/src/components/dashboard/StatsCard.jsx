const StatsCard = ({ groups }) => {
    const totalPoints = groups.reduce((sum, g) => sum + (g.totalPoints || 0), 0);

    return (
        <div className="bg-[#111118] border border-white/[0.07] rounded-[12px] p-6 sticky top-20 h-fit">
            {/* Title */}
            <h2 className="font-['Syne',sans-serif] font-bold text-base text-[#f0f0f5] flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#ffcc44]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Personal Stats
            </h2>

            {groups.length === 0 ? (
                <p className="text-xs text-[#6b6b80] font-mono text-center py-8">
                    Join a group to see your stats.
                </p>
            ) : (
                <>
                    {/* Stat rows */}
                    <div>
                        {groups.map(group => (
                            <div
                                key={group._id}
                                className="flex justify-between items-center py-3.5 border-b border-white/[0.07] last:border-0"
                            >
                                <span className="text-[12px] text-[#6b6b80] truncate max-w-[160px] font-mono">
                                    {group.name}
                                </span>
                                <div className="flex items-baseline gap-1 shrink-0">
                                    <span className="font-['Syne',sans-serif] font-bold text-xl text-[#ffcc44]">
                                        {group.totalPoints || 0}
                                    </span>
                                    <span className="text-[11px] text-[#6b6b80] font-mono">pts</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="border-t border-white/[0.07] mt-5 pt-5">
                        <div className="flex justify-between items-baseline">
                            <span className="text-[10px] uppercase tracking-[1.5px] text-[#6b6b80] font-mono">Total</span>
                            <div className="flex items-baseline gap-1">
                                <span className="font-['Syne',sans-serif] font-extrabold text-4xl text-[#ffcc44]">
                                    {totalPoints}
                                </span>
                                <span className="text-[11px] text-[#6b6b80] font-mono">pts</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StatsCard;
