
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import QuestionDisplay from '../components/ui/QuestionDisplay';

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
                    <Card className="overflow-hidden p-0 border-primary-500/20">
                    {results.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p>No attempts found for this quiz yet.</p>
                            <p className="text-sm mt-2 text-gray-500">Be the first to take it!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs font-medium tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Rank</th>
                                        <th className="px-6 py-4">Participant</th>
                                        <th className="px-6 py-4 text-center">Score</th>

                                        <th className="px-6 py-4 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {results.map((result, index) => {
                                        // Assume total questions if not provided, or calculate from score/accuracy?
                                        // result usually has score. Let's assume we don't have total questions count here easily unless backend sends it.
                                        // We'll just show score.
                                        let rankClass = "bg-gray-800 text-gray-400";
                                        let rankIcon = null;
                                        
                                        if (index === 0) {
                                            rankClass = "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
                                            rankIcon = "👑";
                                        } else if (index === 1) {
                                            rankClass = "bg-gray-300/20 text-gray-300 border border-gray-400/30";
                                            rankIcon = "🥈";
                                        } else if (index === 2) {
                                            rankClass = "bg-orange-700/20 text-orange-400 border border-orange-600/30";
                                            rankIcon = "🥉";
                                        }

                                        return (
                                            <tr key={index} className="hover:bg-gray-800/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rankClass}`}>
                                                        {rankIcon || index + 1}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {result.user?.avatar ? (
                                                                <img className="h-10 w-10 rounded-full border border-gray-700" src={result.user.avatar} alt="" referrerPolicy="no-referrer" />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-300 font-bold border border-primary-500/30">
                                                                    {result.user?.name?.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">
                                                                {result.user?.name || 'Unknown User'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center px-3 py-1 bg-primary-900/30 text-primary-300 rounded-full text-sm font-bold border border-primary-500/20">
                                                        {result.score} pts
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-right text-gray-400 text-sm font-mono">
                                                    {new Date(result.attemptedAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
                ) : (
                    <div className="space-y-6">
                        {(() => {
                            // Check if quiz and attempt exist
                            const attempt = quiz?.attempt;
                            
                            if (!attempt) {
                                return (
                                    <Card className="text-center py-12 border-dashed border-gray-700">
                                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a16.084 16.084 0 00-5.466 5.927m-4.08 4.088a2 3 0 015.344 1.832" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">You haven't taken this quiz yet</h3>
                                        <p className="text-gray-400 mb-6">Test your knowledge and see where you rank!</p>
                                        <Link to={`/quiz/${id}`}>
                                            <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/20">
                                                Start Quiz Now
                                            </button>
                                        </Link>
                                    </Card>
                                );
                            }

                            const myRank = results.findIndex(r => r.user?._id === user._id) + 1;
                            const percentage = Math.round((attempt.score / quiz.questions.length) * 100);
                            const userAnswers = attempt.answers || [];

                            return (
                                <>
                                    <Card className="border-primary-500/30 bg-gradient-to-br from-gray-900 to-gray-800">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                            <div className="text-center md:text-left flex-1">
                                                <h2 className="text-2xl font-bold text-white mb-2">Your Performance</h2>
                                                <p className="text-gray-400">Here's how you did on this quiz</p>
                                                <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                                                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                                                        Attempted on {new Date(attempt.attemptedAt || Date.now()).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-4">
                                                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 min-w-[100px] text-center">
                                                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Score</div>
                                                    <div className="text-2xl font-bold text-primary-400">{attempt.score}/{quiz.questions.length}</div>
                                                </div>
                                                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 min-w-[100px] text-center">
                                                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Rank</div>
                                                    <div className="text-2xl font-bold text-yellow-400">#{myRank}</div>
                                                </div>
                                                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 min-w-[100px] text-center">
                                                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Accuracy</div>
                                                    <div className={`text-2xl font-bold ${percentage >= 70 ? 'text-green-400' : percentage >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                        {percentage}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    <h3 className="text-xl font-bold text-white flex items-center pt-4">
                                        <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Detailed Review
                                    </h3>

                                    <div className="space-y-4">
                                        {quiz.questions.map((q, qIdx) => {
                                            const userAnsObj = userAnswers.find(a => a.questionIndex === qIdx);
                                            const userSelected = userAnsObj?.selectedOption;
                                            const isCorrect = userAnsObj?.isCorrect;

                                            return (
                                                <Card key={qIdx} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                                                    <div className="flex items-start mb-4">
                                                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold text-sm ${isCorrect ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                                            {qIdx + 1}
                                                        </span>
                                                        <h4 className="text-lg font-medium text-white pt-1">
                                                            <QuestionDisplay content={q.question} />
                                                        </h4>
                                                    </div>
                                                    <div className="space-y-2 ml-11">
                                                        {q.options.map((opt, optIdx) => {
                                                            let optionClass = "p-3 rounded-lg border border-gray-700/50 bg-gray-800/50";
                                                            let icon = null;
                                                            
                                                            // Highlight logic
                                                            if (opt === q.correctAnswer) {
                                                                optionClass = "p-3 rounded-lg border border-green-500/50 bg-green-500/10 text-green-200"; // Correct Answer
                                                                icon = <span className="text-green-400 text-sm font-bold ml-2">✓ Correct Answer</span>;
                                                            } else if (opt === userSelected && !isCorrect) {
                                                                optionClass = "p-3 rounded-lg border border-red-500/50 bg-red-500/10 text-red-200"; // Wrong Selection
                                                                icon = <span className="text-red-400 text-sm font-bold ml-2">✗ Your Answer</span>;
                                                            }

                                                            return (
                                                                <div key={optIdx} className={optionClass}>
                                                                    <div className="flex justify-between items-center">
                                                                        <span>{opt}</span>
                                                                        {icon}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default QuizResults;
