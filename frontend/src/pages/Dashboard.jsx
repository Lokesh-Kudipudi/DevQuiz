import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import CreateGroupModal from '../components/CreateGroupModal';
import JoinGroupModal from '../components/JoinGroupModal';

const Dashboard = () => {
    const { user, logout } = useAuth();
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

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <header className="flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-indigo-400">DevQuiz</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-300">Welcome, {user?.name}</span>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition text-sm"
                    >
                        Logout
                    </button>
                </div>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Groups Section */}
                <div className="md:col-span-2">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">Your Groups</h2>
                            <div className="space-x-3">
                                <button 
                                    onClick={() => setIsJoinOpen(true)}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition text-sm"
                                >
                                    Join Group
                                </button>
                                <button 
                                    onClick={() => setIsCreateOpen(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded transition text-sm"
                                >
                                    + Create Group
                                </button>
                            </div>
                        </div>

                        {groups.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">You haven't joined any groups yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {groups.map(group => (
                                    <div key={group._id} className="bg-gray-700 p-4 rounded hover:bg-gray-600 transition cursor-pointer" onClick={() => navigate(`/groups/${group._id}`)}>
                                        <h3 className="font-bold text-lg text-indigo-300">{group.name}</h3>
                                        <p className="text-gray-400 text-sm mt-1">{group.description}</p>
                                        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                                            <span>{group.members.length} Members</span>
                                            <span>Code: {group.inviteCode}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="space-y-6">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-purple-400">Personal Stats</h2>
                        <div className="text-4xl font-bold mb-2">{user?.totalScore || 0}</div>
                        <p className="text-sm text-gray-500">Total Score</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                         <h2 className="text-xl font-semibold mb-4 text-green-400">Recent Activity</h2>
                         <p className="text-gray-400 text-sm">No recent activity.</p>
                    </div>
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
        </div>
    );
};

export default Dashboard;
