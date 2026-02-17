import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import Leaderboard from '../components/Leaderboard';

const GroupDetails = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const { data } = await axios.get(`/api/groups/${id}`);
                setGroup(data);
            } catch (err) {
                setError('Failed to load group details');
            } finally {
                setLoading(false);
            }
        };
        fetchGroup();
    }, [id]);

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;
    if (!group) return <div className="text-white text-center mt-20">Group not found</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <Link to="/dashboard" className="text-gray-400 hover:text-white mb-4 inline-block">&larr; Back to Dashboard</Link>
            
            <header className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-indigo-400">{group.name}</h1>
                        <p className="text-gray-400 mt-2">{group.description}</p>
                        <p className="text-sm text-gray-500 mt-1">Created by: {group.creator?.name}</p>
                    </div>
                     <div className="bg-gray-700 px-4 py-2 rounded text-center">
                        <p className="text-xs text-gray-400 uppercase">Invite Code</p>
                        <p className="text-xl font-mono font-bold tracking-widest">{group.inviteCode}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quizzes Section */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Quizzes</h2>
                            <Link 
                                to={`/groups/${id}/create-quiz`}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded transition text-sm"
                            >
                                + Create Quiz
                            </Link>
                        </div>

                        {group.quizzes && group.quizzes.length > 0 ? (
                            <div className="space-y-4">
                                {group.quizzes.map(quiz => (
                                    <div key={quiz._id} className="bg-gray-700 p-4 rounded hover:bg-gray-600 transition flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-lg">{quiz.title}</h3>
                                            <p className="text-gray-400 text-sm">Topic: {quiz.topic} • Difficulty: {quiz.difficulty}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link 
                                                to={`/quiz/${quiz._id}`}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm"
                                            >
                                                Start
                                            </Link>
                                            <Link 
                                                to={`/quiz/${quiz._id}/results`}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm"
                                            >
                                                Results
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-8">No quizzes created yet.</p>
                        )}
                    </div>
                </div>

                {/* Members Section */}
                <div>
                     <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-6">Members ({group.members.length})</h2>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                             {group.members.map(member => (
                                <div key={member._id} className="flex items-center space-x-3 bg-gray-700 p-2 rounded">
                                    <img 
                                        src={member.avatar || 'https://via.placeholder.com/40'} 
                                        alt={member.name} 
                                        referrerPolicy="no-referrer"
                                        className="w-8 h-8 rounded-full" 
                                    />
                                    <span className="font-medium">{member.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <Leaderboard groupId={id} />
                </div>
            </div>
        </div>
    );
};

export default GroupDetails;
