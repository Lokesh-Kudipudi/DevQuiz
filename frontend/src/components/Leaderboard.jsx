import { useState, useEffect } from 'react';
import axios from '../api/axios';

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
        if (groupId) {
            fetchLeaderboard();
        }
    }, [groupId]);

    if (loading) return <div className="text-gray-400 text-sm">Loading leaderboard...</div>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">Leaderboard</h2>
            <div className="space-y-3">
                {leaderboard.map((user, index) => (
                    <div key={user._id} className="flex items-center justify-between bg-gray-700 p-3 rounded">
                        <div className="flex items-center space-x-3">
                            <span className={`font-bold w-6 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                                #{index + 1}
                            </span>
                            <img 
                                src={user.avatar || 'https://via.placeholder.com/40'} 
                                alt={user.name} 
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-full" 
                            />
                            <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="font-bold text-indigo-300">
                            {user.totalScore} pts
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
