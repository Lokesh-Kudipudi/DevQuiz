import Card from '../ui/Card';

const StatsCard = ({ groups }) => {
    return (
        <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 border-primary-500/20">
            <h2 className="text-lg font-semibold mb-6 flex items-center text-primary-300">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Personal Stats
            </h2>
            
            {groups.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Join a group to see your stats.</p>
            ) : (
                <div className="space-y-4">
                    {groups.map(group => (
                        <div key={group._id} className="flex justify-between items-center border-b border-gray-800 pb-2 last:border-0 last:pb-0">
                            <span className="text-gray-300 truncate pr-4">{group.name}</span>
                            <div className="flex items-end space-x-1 shrink-0">
                                <span className="font-bold text-white">{group.totalPoints || 0}</span>
                                <span className="text-xs text-gray-500 mb-0.5">pts</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default StatsCard;
