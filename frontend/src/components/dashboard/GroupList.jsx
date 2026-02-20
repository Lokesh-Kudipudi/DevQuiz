import Card from '../ui/Card';
import Button from '../ui/Button';

const GroupList = ({ groups, onJoin, onCreate, onNavigate }) => {
    if (groups.length === 0) {
        return (
            <Card className="text-center py-12 flex flex-col items-center justify-center border-dashed border-2 border-gray-800 bg-gray-900/30">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No groups yet</h3>
                <p className="text-gray-400 mb-6 max-w-sm">Join a group to start taking quizzes or create your own to challenge others.</p>
                <Button onClick={onCreate}>Create your first group</Button>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map(group => (
                <Card 
                    key={group._id} 
                    hover 
                    className="cursor-pointer group relative overflow-hidden" 
                    onClick={() => onNavigate(`/groups/${group._id}`)}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-gray-500 group-hover:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg text-white group-hover:text-primary-400 transition-colors mb-2 pr-8">{group.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{group.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-700/50 pt-4 mt-auto">
                        <div className="flex items-center space-x-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>{group.members.length} Members</span>
                        </div>
                        <span className="font-mono bg-gray-800 px-2 py-1 rounded text-primary-300 bg-primary-900/20">{group.inviteCode}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default GroupList;
