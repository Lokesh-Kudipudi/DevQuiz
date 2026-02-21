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
import { BADGE_STYLES, SECTION_LABEL_STYLES } from '../constants/ui';

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
            <div className="max-w-[1200px] mx-auto px-8 py-12 animate-[fadeUp_0.3s_ease_forwards]">
                {/* Page header — spans full width */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h1 className="font-['Syne',sans-serif] font-extrabold text-5xl tracking-[-2px] leading-none text-[#f0f0f5]">
                            Dashboard
                        </h1>
                        <p className="text-[#6b6b80] text-xs mt-2 tracking-wide font-mono">
                            Welcome back, {user?.name}. Ready for a challenge?
                        </p>
                    </div>
                    <div className="flex gap-2.5">
                        <Button variant="outline" onClick={() => setIsJoinOpen(true)} size="md">
                            Join Group
                        </Button>
                        <Button variant="primary" onClick={() => setIsCreateOpen(true)} size="md">
                            + Create Group
                        </Button>
                    </div>
                </div>

                {/* 2-col grid: [main | sidebar] */}
                <div className="grid grid-cols-[1fr_340px] gap-8 items-start">
                    {/* Left: groups */}
                    <div>
                        {/* Section label */}
                        <div className={SECTION_LABEL_STYLES}>
                            <span>Your Groups</span>
                            <span className={BADGE_STYLES}>{groups.length}</span>
                        </div>

                        <GroupList
                            groups={groups}
                            onJoin={() => setIsJoinOpen(true)}
                            onCreate={() => setIsCreateOpen(true)}
                            onNavigate={navigate}
                        />
                    </div>

                    {/* Right: stats */}
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
