import Card from '../ui/Card';

const LeaderboardView = ({ results }) => {
    return (
        <Card className="overflow-hidden p-0 border-primary-500/20">
            {results.length === 0 ? (
                <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No attempts found for this quiz yet.</p>
                    <p className="text-sm mt-2 text-gray-500">Be the first to take it!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs font-medium tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Rank</th>
                                <th className="px-6 py-4">Participant</th>
                                <th className="px-6 py-4 text-center">Score</th>
                                <th className="px-6 py-4 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {results.map((result, index) => {
                                let rankClass = "bg-gray-800 text-gray-400";
                                let rankIcon = null;
                                
                                if (index === 0) {
                                    rankClass = "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
                                    rankIcon = "👑";
                                } else if (index === 1) {
                                    rankClass = "bg-gray-300/20 text-gray-300 border border-gray-400/30";
                                    rankIcon = "🥈";
                                } else if (index === 2) {
                                    rankClass = "bg-orange-700/20 text-orange-400 border border-orange-600/30";
                                    rankIcon = "🥉";
                                }

                                return (
                                    <tr key={index} className="hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rankClass}`}>
                                                {rankIcon || index + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {result.user?.avatar ? (
                                                        <img className="h-10 w-10 rounded-full border border-gray-700" src={result.user.avatar} alt="" referrerPolicy="no-referrer" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-300 font-bold border border-primary-500/30">
                                                            {result.user?.name?.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">
                                                        {result.user?.name || 'Unknown User'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-3 py-1 bg-primary-900/30 text-primary-300 rounded-full text-sm font-bold border border-primary-500/20">
                                                {result.score} pts
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-400 text-sm font-mono">
                                            {new Date(result.attemptedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
};

export default LeaderboardView;
