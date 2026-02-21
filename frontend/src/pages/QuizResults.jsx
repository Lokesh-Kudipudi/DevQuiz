import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import LeaderboardView from '../components/quiz/LeaderboardView';
import MyResultsView from '../components/quiz/MyResultsView';
import { TAB_CONTAINER_STYLES, TAB_STYLES, BACK_LINK_STYLES } from '../constants/ui';

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
                <div className="w-8 h-8 border-2 border-white/[0.07] border-t-[#7fff6e] rounded-full animate-spin" />
            </div>
        </Layout>
    );

    if (error) return (
        <Layout>
            <div className="max-w-[900px] mx-auto px-8 py-20 text-center">
                <div className="text-3xl mb-3 opacity-40">⚠️</div>
                <p className="font-['Syne',sans-serif] font-bold text-xl text-[#ff5555] mb-2">{error}</p>
                <Link to="/dashboard" className={BACK_LINK_STYLES}>← Return to Dashboard</Link>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="max-w-[900px] mx-auto px-8 py-12 animate-[fadeUp_0.3s_ease_forwards]">
                {/* Back */}
                <Link to="/dashboard" className={BACK_LINK_STYLES}>
                    ← Back to Dashboard
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="font-['Syne',sans-serif] font-extrabold text-[42px] tracking-[-2px] text-[#f0f0f5] mb-1">
                        Quiz Results
                    </h1>
                    <p className="text-xs text-[#6b6b80] font-mono">Track performance and progress</p>
                </div>

                {/* Tab switcher */}
                <div className="flex justify-center mb-8">
                    <div className={TAB_CONTAINER_STYLES}>
                        <button
                            onClick={() => setActiveTab('leaderboard')}
                            className={activeTab === 'leaderboard' ? TAB_STYLES.active : TAB_STYLES.inactive}
                        >
                            Leaderboard
                        </button>
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={activeTab === 'personal' ? TAB_STYLES.active : TAB_STYLES.inactive}
                        >
                            My Results
                        </button>
                    </div>
                </div>

                {/* Content */}
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
