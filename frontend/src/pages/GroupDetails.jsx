import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import Leaderboard from '../components/Leaderboard';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

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

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        </Layout>
    );
    
    if (error) return (
        <Layout>
            <div className="text-center mt-20">
                <div className="inline-block p-4 rounded-full bg-red-500/10 text-red-500 mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-xl text-red-400 font-medium">{error}</p>
                <Link to="/dashboard" className="mt-4 inline-block text-gray-400 hover:text-white underline">Return to Dashboard</Link>
            </div>
        </Layout>
    );

    if (!group) return (
        <Layout>
            <div className="text-center mt-20 text-gray-400">Group not found</div>
        </Layout>
    );

    return (
        <Layout>
            <Link to="/dashboard" className="text-gray-400 hover:text-primary-400 mb-6 inline-flex items-center transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </Link>
            
            <Card className="mb-8 border-primary-500/20 bg-gradient-to-r from-gray-800 to-gray-900/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{group.name}</h1>
                        <p className="text-gray-300 text-lg mb-4">{group.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                             <div className="flex items-center mr-6">
                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Created by: <span className="text-primary-300 ml-1">{group.creator?.name}</span>
                             </div>
                             <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(group.createdAt || Date.now()).toLocaleDateString()}
                             </div>
                        </div>
                    </div>
                     <div className="bg-gray-950/50 border border-gray-700/50 px-6 py-3 rounded-xl text-center backdrop-blur-sm self-stretch md:self-auto flex flex-col justify-center min-w-[140px]">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Invite Code</p>
                        <div className="flex items-center justify-center space-x-2">
                             <p className="text-2xl font-mono font-bold text-primary-400 tracking-widest">{group.inviteCode}</p>
                             <button className="text-gray-500 hover:text-white transition-colors" title="Copy code" onClick={() => navigator.clipboard.writeText(group.inviteCode)}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                             </button>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quizzes Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Coding Rounds Section */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-white flex items-center">
                            <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Coding Rounds
                        </h2>
                        <div className="flex gap-4">
                            <Link to={`/groups/${id}/create-coding-round`}>
                                <Button size="sm" variant="secondary" className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    Create Coding Round
                                </Button>
                            </Link>
                            <Link to={`/groups/${id}/create-quiz`}>
                                <Button size="sm">+ Create Quiz</Button>
                            </Link>
                        </div>
                    </div>

                    {group.codingRounds && group.codingRounds.length > 0 ? (
                        <div className="space-y-4 mb-8">
                            {group.codingRounds.map(round => (
                                <Card key={round._id} className="group hover:border-primary-500/30 transition-all duration-300 relative">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h3 className="font-bold text-xl text-white group-hover:text-primary-400 transition-colors mb-1 pr-8">{round.title}</h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {round.timeLimit} mins
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    {round.questions.length} Questions
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-3 w-full sm:w-auto">
                                            <Link to={`/coding-round/${round._id}`} className="flex-1 sm:flex-none">
                                                <Button size="sm" className="w-full">
                                                    {round.status === 'Pending' ? 'Enter Lobby' : 
                                                     round.status === 'Live' ? 'Join Live' : 
                                                     round.status === 'Completed' ? 'Results' : 'Enter Round'}
                                                </Button>
                                            </Link>

                                            <button 
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    if(!window.confirm('Are you sure you want to delete this coding round?')) return;
                                                    try {
                                                        await axios.delete(`/api/coding-rounds/${round._id}`);
                                                        setGroup(prev => ({
                                                            ...prev,
                                                            codingRounds: prev.codingRounds.filter(r => r._id !== round._id)
                                                        }));
                                                    } catch (err) {
                                                        alert('Failed to delete round');
                                                    }
                                                }}
                                                className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-500/10"
                                                title="Delete Round"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                         <Card className="text-center py-12 border-dashed border-gray-800 mb-8">
                            <p className="text-gray-400 mb-4">No coding rounds created yet.</p>
                            <Link to={`/groups/${id}/create-coding-round`}>
                                <Button variant="outline" size="sm">Create First Round</Button>
                            </Link>
                        </Card>
                    )}

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-white flex items-center">
                            <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Quizzes
                        </h2>
                    </div>

                    {group.quizzes && group.quizzes.length > 0 ? (
                        <div className="space-y-4">
                            {group.quizzes.map(quiz => (
                                <Card key={quiz._id} className="group hover:border-primary-500/30 transition-all duration-300">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h3 className="font-bold text-xl text-white group-hover:text-primary-400 transition-colors mb-1">{quiz.title}</h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                                                <span className="flex items-center">
                                                    <span className={`w-2 h-2 rounded-full mr-2 ${
                                                        quiz.difficulty === 'Easy' ? 'bg-green-500' : 
                                                        quiz.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}></span>
                                                    {quiz.difficulty}
                                                </span>
                                                <span className="flex items-center">
                                                     <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                    {quiz.topic}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-3 w-full sm:w-auto">
                                            <Link to={`/quiz/${quiz._id}`} className="flex-1 sm:flex-none">
                                                <Button size="sm" className="w-full">Start</Button>
                                            </Link>
                                            <Link to={`/quiz/${quiz._id}/results`} className="flex-1 sm:flex-none">
                                                <Button size="sm" variant="secondary" className="w-full">Results</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-12 border-dashed border-gray-800">
                            <p className="text-gray-400 mb-4">No quizzes created yet.</p>
                            <Link to={`/groups/${id}/create-quiz`}>
                                <Button variant="outline" size="sm">Create the first quiz</Button>
                            </Link>
                        </Card>
                    )}
                </div>

                {/* Members & Leaderboard Section */}
                <div className="space-y-8">
                     <Card>
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Members <span className="ml-2 text-sm text-gray-500 font-normal">({group.members.length})</span>
                        </h2>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                             {group.members.map(member => (
                                <div key={member._id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                                    {member.avatar ? (
                                        <img 
                                            src={member.avatar} 
                                            alt={member.name} 
                                            referrerPolicy="no-referrer"
                                            className="w-10 h-10 rounded-full border-2 border-gray-700" 
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary-900/50 text-primary-300 flex items-center justify-center font-bold border-2 border-gray-700">
                                            {member.name?.charAt(0)}
                                        </div>
                                    )}
                                    <span className="font-medium text-gray-200">{member.name}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                    
                    <Card>
                        <Leaderboard groupId={id} />
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default GroupDetails;
