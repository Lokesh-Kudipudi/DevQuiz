import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Button from '../components/ui/Button';
import CreateGroupModal from '../components/CreateGroupModal';
import JoinGroupModal from '../components/JoinGroupModal';
import GroupList from '../components/dashboard/GroupList';
import StatsCard from '../components/dashboard/StatsCard';

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

                    <GroupList 
                        groups={groups} 
                        onJoin={() => setIsJoinOpen(true)} 
                        onCreate={() => setIsCreateOpen(true)}
                        onNavigate={navigate}
                    />
                </div>


                {/* Stats Section */}
                <div className="space-y-6">
                    <StatsCard groups={groups} />
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

