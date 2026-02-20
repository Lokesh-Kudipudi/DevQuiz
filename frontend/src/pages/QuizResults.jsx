
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import LeaderboardView from '../components/quiz/LeaderboardView';
import MyResultsView from '../components/quiz/MyResultsView';

const QuizResults = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('leaderboard');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resultsRes, quizRes] = await Promise.all([
                    axios.get(`/api/quizzes/${id}/results`),
                    axios.get(`/api/quizzes/${id}`)
                ]);
                setResults(resultsRes.data);
                setQuiz(quizRes.data);
            } catch (err) {
                setError('Failed to load data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p className="text-xl text-red-400 font-medium">{error}</p>
                <Link to="/dashboard" className="mt-4 inline-block text-gray-400 hover:text-white underline">Return to Dashboard</Link>
            </div>
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

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Quiz Results</h1>
                    <p className="text-gray-400">Track performance and progress</p>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="bg-gray-800 p-1 rounded-xl inline-flex">
                        <button
                            onClick={() => setActiveTab('leaderboard')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === 'leaderboard'
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Leaderboard
                        </button>
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === 'personal'
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            My Results
                        </button>
                    </div>
                </div>

                {activeTab === 'leaderboard' ? (
                    <LeaderboardView results={results} />
                ) : (
                    <MyResultsView 
                        quiz={quiz} 
                        attempt={quiz?.attempt} 
                        myRank={results.findIndex(r => r.user?._id === user._id) + 1}
                        quizId={id}
                    />
                )}
            </div>
        </Layout>
    );
};

export default QuizResults;

