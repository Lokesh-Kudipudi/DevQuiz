import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import CreateGroupModal from '../components/CreateGroupModal';
import JoinGroupModal from '../components/JoinGroupModal';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);

    const fetchGroups = async () => {
        try {
            const { data } = await axios.get('/api/groups');
            setGroups(data);
        } catch (err) {
            console.error('Failed to fetch groups', err);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <Layout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Welcome back, {user?.name}. Ready for a challenge?</p>
                </div>
                <div className="flex space-x-3">
                    <Button 
                        variant="secondary" 
                        onClick={() => setIsJoinOpen(true)}
                        size="sm"
                    >
                        Join Group
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={() => setIsCreateOpen(true)}
                        size="sm"
                    >
                        + Create Group
                    </Button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Groups Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center space-x-2 mb-2">
                        <h2 className="text-xl font-semibold text-white">Your Groups</h2>
                        <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full border border-gray-700">{groups.length}</span>
                    </div>

                    {groups.length === 0 ? (
                        <Card className="text-center py-12 flex flex-col items-center justify-center border-dashed border-2 border-gray-800 bg-gray-900/30">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-600">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">No groups yet</h3>
                            <p className="text-gray-400 mb-6 max-w-sm">Join a group to start taking quizzes or create your own to challenge others.</p>
                            <Button onClick={() => setIsCreateOpen(true)}>Create your first group</Button>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {groups.map(group => (
                                <Card 
                                    key={group._id} 
                                    hover 
                                    className="cursor-pointer group relative overflow-hidden" 
                                    onClick={() => navigate(`/groups/${group._id}`)}
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
                    )}
                </div>

                {/* Stats Section */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 border-primary-500/20">
                        <h2 className="text-lg font-semibold mb-6 flex items-center text-primary-300">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Personal Stats
                        </h2>
                        <div className="flex items-end space-x-2 mb-1">
                             <div className="text-5xl font-bold text-white tracking-tighter">{user?.totalScore || 0}</div>
                             <div className="text-sm text-gray-400 mb-2 font-medium">pts</div>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Total Score across all quizzes</p>
                        
                        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2 overflow-hidden">
                            <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Level 1</span>
                            <span>0% to Level 2</span>
                        </div>
                    </Card>

                    <Card>
                         <h2 className="text-lg font-semibold mb-4 text-gray-200 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Recent Activity
                         </h2>
                         <div className="space-y-4">
                             {/* Placeholder for no activity */}
                             <div className="text-center py-6 text-gray-500 text-sm border border-dashed border-gray-700/50 rounded-lg">
                                 No recent activity.
                             </div>
                         </div>
                    </Card>
                </div>
            </div>

            <CreateGroupModal 
                isOpen={isCreateOpen} 
                onClose={() => setIsCreateOpen(false)} 
                onGroupCreated={fetchGroups} 
            />
            
            <JoinGroupModal 
                isOpen={isJoinOpen} 
                onClose={() => setIsJoinOpen(false)} 
                onGroupJoined={fetchGroups} 
            />
        </Layout>
    );
};

export default Dashboard;
