import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';

const QuestionText = ({ text }) => {
    const hasCode = text.includes('```');
    if (!hasCode) return <p className="text-gray-100 font-medium text-sm leading-relaxed">{text}</p>;
    return (
        <div className="text-gray-100 font-medium text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                    pre({ children }) {
                        return (
                            <pre className="rounded-xl overflow-x-auto my-2 p-4 bg-[#0d1117] border border-gray-700/50 text-sm">
                                {children}
                            </pre>
                        );
                    }
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    );
};

const OAResults = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data: res } = await axios.get(`/api/online-assessments/${id}/results`);
                setData(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-2 border-white/[0.07] border-t-[#7fff6e] rounded-full animate-spin" />
            </div>
        </Layout>
    );

    if (!data) return (
        <Layout>
            <div className="text-center mt-20 text-gray-400">Results not found</div>
        </Layout>
    );

    const myParticipant = data.myParticipant;
    const mySubmissions = myParticipant?.sectionSubmissions || [];
    const myTotalScore = mySubmissions.reduce((s, ss) => s + (ss.score || 0), 0);
    const maxPossible = data.sections.reduce((s, sec) => s + sec.questionCount, 0);
    const isTerminated = myParticipant?.status === 'terminated';

    return (
        <Layout>
          <div className="max-w-[1200px] mx-auto px-8 py-10">
            <Link to={`/groups/${data.group?._id || '#'}`} className="text-[#6b6b80] hover:text-[#7fff6e] mb-6 inline-flex items-center gap-2 font-mono text-sm transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Group
            </Link>

            {/* Title */}
            <Card className="mb-6 border-violet-500/20 bg-gradient-to-r from-gray-800 to-gray-900/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">{data.title}</h1>
                        <p className="text-gray-400 text-sm">{data.sections.length} sections · {maxPossible} total marks</p>
                    </div>
                    {myParticipant && (
                        <div className="text-center bg-gray-950/50 border border-violet-500/30 rounded-xl px-6 py-3 min-w-[130px]">
                            {isTerminated ? (
                                <p className="text-red-400 font-semibold text-sm">Terminated</p>
                            ) : (
                                <>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">My Score</p>
                                    <p className="text-3xl font-bold text-violet-400">{myTotalScore}</p>
                                    <p className="text-xs text-gray-500">/ {maxPossible}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            {isTerminated && (
                <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Your assessment was terminated (back navigation, internet loss, or manual end). Submitted sections are shown below.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ── My Results ── */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        My Results
                    </h2>

                    {/* Section tabs */}
                    <div className="flex gap-2 flex-wrap">
                        {data.sections.map((section, idx) => {
                            const sub = mySubmissions.find(ss => ss.sectionIndex === idx);
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveSection(idx)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                                        activeSection === idx
                                            ? 'bg-violet-600 border-violet-600 text-white'
                                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                                    }`}
                                >
                                    {section.name}
                                    {sub ? (
                                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                                            activeSection === idx ? 'bg-violet-500/50' : 'bg-gray-700'
                                        }`}>
                                            {sub.score}/{section.questionCount}
                                        </span>
                                    ) : (
                                        <span className="ml-2 text-xs opacity-50">N/A</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Questions for active section */}
                    {(() => {
                        const section = data.sections[activeSection];
                        const sub = mySubmissions.find(ss => ss.sectionIndex === activeSection);

                        if (!sub) {
                            return (
                                <Card className="text-center py-10 border-dashed border-gray-700">
                                    <p className="text-gray-400">This section was not attempted.</p>
                                </Card>
                            );
                        }

                        return (
                            <div className="space-y-4">
                                {/* Section summary */}
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span className="text-green-400 font-semibold">
                                        ✓ {sub.score} correct
                                    </span>
                                    <span className="text-red-400 font-semibold">
                                        ✗ {section.questionCount - sub.score} incorrect
                                    </span>
                                    <span>
                                        ⏱ {Math.floor(sub.timeTaken / 60)}m {sub.timeTaken % 60}s
                                    </span>
                                </div>

                                {section.questions.map((q, qIdx) => {
                                    const myAnswer = sub.answers[qIdx];
                                    const isCorrect = myAnswer === q.correctAnswer;
                                    const isSkipped = !myAnswer;

                                    return (
                                        <Card
                                            key={qIdx}
                                            className={`border-l-4 ${
                                                isSkipped ? 'border-l-gray-600' :
                                                isCorrect ? 'border-l-green-500' : 'border-l-red-500'
                                            }`}
                                        >
                                            <div className="flex gap-3 mb-3">
                                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                                    isSkipped ? 'bg-gray-700 text-gray-400' :
                                                    isCorrect ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                                                }`}>
                                                    {qIdx + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <QuestionText text={q.question} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-1.5 pl-10">
                                                {q.options.map((opt, oIdx) => {
                                                    const isMyAnswer = opt === myAnswer;
                                                    const isCorrectOpt = opt === q.correctAnswer;
                                                    return (
                                                        <div
                                                            key={oIdx}
                                                            className={`px-3 py-2 rounded-lg text-sm border flex items-center gap-2 ${
                                                                isCorrectOpt
                                                                    ? 'border-green-500/60 bg-green-500/10 text-green-300'
                                                                    : isMyAnswer && !isCorrect
                                                                        ? 'border-red-500/60 bg-red-500/10 text-red-300'
                                                                        : 'border-gray-700/50 text-gray-500'
                                                            }`}
                                                        >
                                                            {isCorrectOpt && <span className="text-green-400">✓</span>}
                                                            {isMyAnswer && !isCorrect && <span className="text-red-400">✗</span>}
                                                            {!isCorrectOpt && !(isMyAnswer && !isCorrect) && <span className="w-3" />}
                                                            {opt}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {isSkipped && (
                                                <p className="pl-10 mt-2 text-xs text-gray-500">Not answered — Correct: <span className="text-green-400">{q.correctAnswer}</span></p>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>

                {/* ── Leaderboard ── */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Leaderboard
                    </h2>

                    <Card>
                        {data.leaderboard && data.leaderboard.length > 0 ? (
                            <div className="space-y-3">
                                {data.leaderboard.map((entry, rank) => {
                                    const isMe = (entry.user?._id || entry.user)?.toString() === user?._id?.toString();
                                    const rankColors = ['text-amber-400', 'text-gray-300', 'text-amber-600'];
                                    const rankEmoji = ['🥇', '🥈', '🥉'];

                                    return (
                                        <div
                                            key={rank}
                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                                isMe
                                                    ? 'border-violet-500/40 bg-violet-500/10'
                                                    : 'border-gray-700/50 bg-gray-800/30'
                                            }`}
                                        >
                                            <span className={`text-lg w-6 text-center flex-shrink-0 ${rankColors[rank] || 'text-gray-500'}`}>
                                                {rank < 3 ? rankEmoji[rank] : `#${rank + 1}`}
                                            </span>

                                            <div className="flex-1 min-w-0">
                                                <p className={`font-medium truncate ${isMe ? 'text-violet-300' : 'text-white'}`}>
                                                    {entry.user?.name || 'Unknown'}
                                                    {isMe && <span className="ml-1 text-xs text-violet-400">(you)</span>}
                                                </p>
                                                <div className="flex gap-2 flex-wrap mt-0.5">
                                                    {entry.sectionBreakdown.map((sb, sIdx) => (
                                                        <span key={sIdx} className="text-xs text-gray-500">
                                                            {sb.sectionName}: {sb.score}/{sb.maxScore}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className={`text-lg font-bold ${isMe ? 'text-violet-400' : 'text-white'}`}>
                                                    {entry.totalScore}
                                                </p>
                                                <p className="text-xs text-gray-500">/{entry.maxPossible}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-gray-400 py-6">No submissions yet.</p>
                        )}
                    </Card>

                    {/* Section score summary */}
                    {mySubmissions.length > 0 && (
                        <Card className="border-violet-500/20">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">My Section Breakdown</h3>
                            <div className="space-y-2">
                                {mySubmissions.map(ss => {
                                    const section = data.sections[ss.sectionIndex];
                                    const pct = section ? Math.round((ss.score / section.questionCount) * 100) : 0;
                                    return (
                                        <div key={ss.sectionIndex}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-300">{section?.name}</span>
                                                <span className="text-white font-medium">{ss.score}/{section?.questionCount}</span>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-2 rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
          </div>
        </Layout>
    );
};

export default OAResults;
