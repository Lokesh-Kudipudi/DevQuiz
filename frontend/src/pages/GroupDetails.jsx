import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Leaderboard from '../components/Leaderboard';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const GroupDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ show: false, type: null, id: null, title: '' });
    const [collapsed, setCollapsed] = useState({ groupDetails: true, members: true, leaderboard: true });

    const toggleCollapse = (key) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

    const handleDeleteClick = (type, id, title) => {
        setDeleteModal({ show: true, type, id, title });
    };

    const confirmDelete = async () => {
        const { type, id } = deleteModal;
        try {
            if (type === 'quiz') {
                 await axios.delete(`/api/quizzes/${id}`);
                 setGroup(prev => ({
                     ...prev,
                     quizzes: prev.quizzes.filter(q => q._id !== id)
                 }));
                 toast.success('Quiz deleted successfully');
            } else if (type === 'coding-round') {
                 await axios.delete(`/api/coding-rounds/${id}`);
                 setGroup(prev => ({
                     ...prev,
                     codingRounds: prev.codingRounds.filter(r => r._id !== id)
                 }));
                 toast.success('Coding round deleted successfully');
            } else if (type === 'online-assessment') {
                 await axios.delete(`/api/online-assessments/${id}`);
                 setGroup(prev => ({
                     ...prev,
                     onlineAssessments: prev.onlineAssessments.filter(a => a._id !== id)
                 }));
                 toast.success('Assessment deleted successfully');
            }
        } catch (err) {
            toast.error(`Failed to delete`);
            console.error(err);
        } finally {
            setDeleteModal({ show: false, type: null, id: null, title: '' });
        }
    };

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

        const handleRefresh = () => fetchGroup();
        window.addEventListener('group-content-updated', handleRefresh);
        return () => window.removeEventListener('group-content-updated', handleRefresh);
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
            <div className="flex justify-between items-center mb-6">
                <Link to="/dashboard" className="text-gray-400 hover:text-primary-400 inline-flex items-center transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </Link>
                <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New
                </Button>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Create New</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link 
                                to={`/groups/${id}/create-quiz`}
                                className="group relative overflow-hidden bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-green-500/50 rounded-xl p-5 transition-all duration-300 text-left"
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center mb-3 text-green-400 group-hover:text-green-300 group-hover:scale-110 transition-all">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">Quiz</h3>
                                    <p className="text-sm text-gray-400">Create a multiple-choice quiz on any topic.</p>
                                </div>
                            </Link>

                            <Link 
                                to={`/groups/${id}/create-oa`}
                                className="group relative overflow-hidden bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-violet-500/50 rounded-xl p-5 transition-all duration-300 text-left"
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-violet-900/30 rounded-lg flex items-center justify-center mb-3 text-violet-400 group-hover:text-violet-300 group-hover:scale-110 transition-all">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">Online Assessment</h3>
                                    <p className="text-sm text-gray-400">Create a multi-section timed MCQ assessment.</p>
                                </div>
                            </Link>

                            <Link 
                                to={`/groups/${id}/create-coding-round`}
                                className="group relative overflow-hidden bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-primary-500/50 rounded-xl p-5 transition-all duration-300 text-left"
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-primary-900/30 rounded-lg flex items-center justify-center mb-3 text-primary-400 group-hover:text-primary-300 group-hover:scale-110 transition-all">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">Coding Round</h3>
                                    <p className="text-sm text-gray-400">Create a coding challenge with custom or AI-generated questions.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModal({ show: false, type: null, id: null, title: '' })}>
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center mb-4 text-red-500">
                            <div className="p-3 bg-red-500/10 rounded-full mr-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">Delete {deleteModal.type === 'quiz' ? 'Quiz' : 'Coding Round'}</h3>
                        </div>
                        
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete <span className="font-semibold text-white">"{deleteModal.title}"</span>? 
                            This action cannot be undone and all associated attempts will be permanently removed.
                        </p>

                        <div className="flex justify-end gap-3">
                            <Button 
                                variant="ghost" 
                                onClick={() => setDeleteModal({ show: false, type: null, id: null, title: '' })}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="bg-red-600 hover:bg-red-700 text-white border-none"
                                onClick={confirmDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quizzes Section */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-white flex items-center">
                            <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Quizzes
                        </h2>
                    </div>

                    {group.quizzes && group.quizzes.length > 0 ? (
                        <div className="space-y-4 mb-8">
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
                                            {(() => {
                                                const hasAttempted = quiz.participants?.some(p => p.user === user._id);
                                                return !hasAttempted && (
                                                    <Link to={`/quiz/${quiz._id}`} className="flex-1 sm:flex-none">
                                                        <Button size="sm" className="w-full">Start</Button>
                                                    </Link>
                                                );
                                            })()}
                                            <Link to={`/quiz/${quiz._id}/results`} className="flex-1 sm:flex-none">
                                                <Button size="sm" variant="secondary" className="w-full">Results</Button>
                                            </Link>
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteClick('quiz', quiz._id, quiz.title);
                                                }}
                                                className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-500/10"
                                                title="Delete Quiz"
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
                            <p className="text-gray-400 mb-4">No quizzes created yet.</p>
                            <Button variant="outline" size="sm" onClick={() => setShowCreateModal(true)}>Create the first quiz</Button>
                        </Card>
                    )}

                    {/* Online Assessments Section */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-white flex items-center">
                            <svg className="w-6 h-6 mr-2 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Online Assessments
                        </h2>
                    </div>

                    {group.onlineAssessments && group.onlineAssessments.length > 0 ? (
                        <div className="space-y-4 mb-8">
                            {group.onlineAssessments.map(oa => {
                                const myParticipant = oa.participants?.find(p =>
                                    (p.user?._id || p.user)?.toString() === user._id?.toString()
                                );
                                const attempted = !!myParticipant;
                                return (
                                    <Card key={oa._id} className="group hover:border-violet-500/30 transition-all duration-300">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h3 className="font-bold text-xl text-white group-hover:text-violet-400 transition-colors mb-1">{oa.title}</h3>
                                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                                        </svg>
                                                        {oa.sections?.length || 0} Sections
                                                    </span>
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                        {oa.sections?.reduce((s, sec) => s + sec.questionCount, 0) || 0} Questions
                                                    </span>
                                                    {myParticipant && (
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                            myParticipant.status === 'completed' ? 'bg-green-900/40 text-green-400' :
                                                            myParticipant.status === 'terminated' ? 'bg-red-900/40 text-red-400' :
                                                            'bg-amber-900/40 text-amber-400'
                                                        }`}>
                                                            {myParticipant.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex space-x-3 w-full sm:w-auto items-center">
                                                {!attempted && (
                                                    <Link to={`/oa/${oa._id}`} className="flex-1 sm:flex-none">
                                                        <Button size="sm" className="w-full bg-violet-600 hover:bg-violet-700 border-violet-600">Start</Button>
                                                    </Link>
                                                )}
                                                {attempted && myParticipant?.status === 'active' && (
                                                    <Link to={`/oa/${oa._id}`} className="flex-1 sm:flex-none">
                                                        <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 border-amber-600">Resume</Button>
                                                    </Link>
                                                )}
                                                <Link to={`/oa/${oa._id}/results`} className="flex-1 sm:flex-none">
                                                    <Button size="sm" variant="secondary" className="w-full">Results</Button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick('online-assessment', oa._id, oa.title)}
                                                    className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-500/10"
                                                    title="Delete Assessment"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="text-center py-12 border-dashed border-gray-800 mb-8">
                            <p className="text-gray-400 mb-4">No online assessments created yet.</p>
                            <Button variant="outline" size="sm" onClick={() => setShowCreateModal(true)}>Create Assessment</Button>
                        </Card>
                    )}

                    {/* Coding Rounds Section */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-white flex items-center">
                            <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Coding Rounds
                        </h2>
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
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteClick('coding-round', round._id, round.title);
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
                            <Button variant="outline" size="sm" onClick={() => setShowCreateModal(true)}>Create First Round</Button>
                        </Card>
                    )}


                </div>

                {/* Sidebar */}
                <div className="space-y-4">

                    {/* Group Details Card */}
                    <Card className="border-primary-500/20 bg-gradient-to-b from-gray-800 to-gray-900/50">
                        <button
                            onClick={() => toggleCollapse('groupDetails')}
                            className="w-full flex items-center justify-between text-left group"
                        >
                            <h2 className="text-lg font-semibold text-white flex items-center">
                                <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Group Details
                            </h2>
                            <svg
                                className={`w-5 h-5 text-gray-400 group-hover:text-white transition-transform duration-200 ${collapsed.groupDetails ? '-rotate-90' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {!collapsed.groupDetails && (
                            <div className="mt-4 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{group.name}</h3>
                                    <p className="text-gray-400 text-sm mt-1">{group.description}</p>
                                </div>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Created by <span className="text-primary-300 font-medium">{group.creator?.name}</span></span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{new Date(group.createdAt || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="bg-gray-950/50 border border-gray-700/50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Invite Code</p>
                                    <div className="flex items-center justify-center space-x-2">
                                        <p className="text-xl font-mono font-bold text-primary-400 tracking-widest">{group.inviteCode}</p>
                                        <button
                                            className="text-gray-500 hover:text-white transition-colors"
                                            title="Copy code"
                                            onClick={() => { navigator.clipboard.writeText(group.inviteCode); toast.success('Invite code copied!'); }}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Members Card */}
                    <Card>
                        <button
                            onClick={() => toggleCollapse('members')}
                            className="w-full flex items-center justify-between text-left group"
                        >
                            <h2 className="text-lg font-semibold text-white flex items-center">
                                <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Members
                                <span className="ml-2 text-sm text-gray-500 font-normal">({group.members.length})</span>
                            </h2>
                            <svg
                                className={`w-5 h-5 text-gray-400 group-hover:text-white transition-transform duration-200 ${collapsed.members ? '-rotate-90' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {!collapsed.members && (
                            <div className="mt-4 space-y-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                                {group.members.map(member => (
                                    <div key={member._id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                                        {member.avatar ? (
                                            <img
                                                src={member.avatar}
                                                alt={member.name}
                                                referrerPolicy="no-referrer"
                                                className="w-9 h-9 rounded-full border-2 border-gray-700"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-primary-900/50 text-primary-300 flex items-center justify-center font-bold border-2 border-gray-700 text-sm">
                                                {member.name?.charAt(0)}
                                            </div>
                                        )}
                                        <span className="font-medium text-gray-200 text-sm">{member.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Leaderboard Card */}
                    <Card>
                        <button
                            onClick={() => toggleCollapse('leaderboard')}
                            className="w-full flex items-center justify-between text-left group"
                        >
                            <h2 className="text-lg font-semibold text-white flex items-center">
                                <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Leaderboard
                            </h2>
                            <svg
                                className={`w-5 h-5 text-gray-400 group-hover:text-white transition-transform duration-200 ${collapsed.leaderboard ? '-rotate-90' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div className={`mt-4 ${collapsed.leaderboard ? 'hidden' : ''}`}>
                            <Leaderboard groupId={id} />
                        </div>
                    </Card>

                </div>
            </div>
        </Layout>
    );
};

export default GroupDetails;
