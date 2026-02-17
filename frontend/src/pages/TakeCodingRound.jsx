import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import CodeEditor from '../components/quiz/CodeEditor';
import LiveLeaderboard from '../components/quiz/LiveLeaderboard';
import { useAuth } from '../context/AuthContext';

const TakeCodingRound = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [round, setRound] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error'
    
    // Store user code for each question locally to avoid losing it on nav
    const codeRef = useRef({}); 
    
    useEffect(() => {
        const fetchRound = async () => {
            try {
                // First join the round to start timer/track participation
                await axios.post(`/api/coding-rounds/${id}/join`);
                
                // Then get details
                const { data } = await axios.get(`/api/coding-rounds/${id}`);
                setRound(data);
                
                // Initialize code refs with starter code or previously submitted code
                data.questions.forEach(q => {
                    const status = data.participant?.questionStatus?.find(qs => qs.questionId === q._id);
                    codeRef.current[q._id] = status?.code || q.starterCode;
                });

                // Calculate time left
                if (data.participant?.startTime) {
                    const startTime = new Date(data.participant.startTime).getTime();
                    const limitMs = data.timeLimit * 60 * 1000;
                    const now = new Date().getTime();
                    const passed = now - startTime;
                    const remaining = Math.max(0, limitMs - passed);
                    setTimeLeft(Math.floor(remaining / 1000));
                }
            } catch (err) {
                console.error(err);
                // Handle already joined or other errors gracefully
            } finally {
                setLoading(false);
            }
        };
        fetchRound();
    }, [id]);

    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            // Auto submit or end round logic could go here
            return;
        }
        
        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleCodeChange = (value) => {
        if (round) {
            const qId = round.questions[currentQuestionIndex]._id;
            codeRef.current[qId] = value;
        }
    };

    const handleSubmitCode = async (code, output) => {
        // This function is triggered by the CodeEditor's "Run" or we can separate Run vs Submit.
        // For this MVP, let's say "Run" just tests locally (Piston), and we add a "Submit Solution" button
        // that actually sends it to the backend for scoring.
    };
    
    const submitSolution = async () => {
        setSubmissionStatus('submitting');
        const question = round.questions[currentQuestionIndex];
        const code = codeRef.current[question._id];
        
        try {
            // In a real app, we'd run hidden test cases on backend. 
            // Here, we trust the "Run" correctness or just submit what we have.
            // Let's assume the user ran it and is happy.
            
            await axios.post(`/api/coding-rounds/${id}/submit`, {
                questionId: question._id,
                code: code,
                passed: true // Mocking 'passed' for now since we don't have distinct judge backend
            });
            setSubmissionStatus('success');
            setTimeout(() => setSubmissionStatus(null), 2000);
            
            // Move to next question if available
            if (currentQuestionIndex < round.questions.length - 1) {
               // setCurrentQuestionIndex(prev => prev + 1);
            }
        } catch (err) {
            console.error(err);
            setSubmissionStatus('error');
        }
    };

    if (loading) return (
        <Layout>
             <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        </Layout>
    );

    if (!round) return <Layout>Round not found</Layout>;

    const currentQuestion = round.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-gray-800 bg-gray-900 px-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link to={`/groups/${round.group._id || round.group}`} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-xl font-bold">{round.title}</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className={`px-4 py-2 rounded-lg font-mono font-bold text-xl ${
                        timeLeft < 300 ? 'bg-red-900/50 text-red-500' : 'bg-gray-800 text-white'
                    }`}>
                        {formatTime(timeLeft)}
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/groups/${round.group._id || round.group}`)}>
                        Quit Round
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Problem Description */}
                <div className="w-1/3 border-r border-gray-800 flex flex-col bg-gray-900/50">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <div className="flex gap-2">
                            {round.questions.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                                        currentQuestionIndex === idx
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold">{currentQuestion.title}</h2>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                currentQuestion.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' :
                                currentQuestion.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                                'bg-red-900/30 text-red-400'
                            }`}>
                                {currentQuestion.difficulty}
                            </span>
                        </div>
                        
                        <div className="prose prose-invert max-w-none mb-8">
                            <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                                {currentQuestion.description}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-200">Test Cases</h3>
                            {currentQuestion.testCases.map((tc, idx) => (
                                <div key={idx} className="bg-gray-800 rounded-lg p-3 text-sm font-mono border border-gray-700">
                                    <div className="mb-2">
                                        <span className="text-gray-500">Input:</span> <span className="text-white">{tc.input}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Output:</span> <span className="text-green-400">{tc.expectedOutput}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="p-4 border-t border-gray-800">
                        <LiveLeaderboard roundId={id} currentUserId={user?._id} />
                    </div>
                </div>

                {/* Right Panel: Code Editor */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                    <div className="flex-1 overflow-hidden p-4">
                        <CodeEditor 
                            key={currentQuestion._id} // Re-mount on question change
                            initialCode={codeRef.current[currentQuestion._id]} 
                            initialLanguage={currentQuestion.language || 'cpp'}
                            onCodeChange={handleCodeChange}
                        />
                    </div>
                    <div className="h-16 bg-gray-900 border-t border-gray-800 flex justify-end items-center px-6 gap-4">
                         {submissionStatus === 'success' && (
                             <span className="text-green-500 font-medium">Submitted Successfully!</span>
                         )}
                         {submissionStatus === 'error' && (
                             <span className="text-red-500 font-medium">Failed to submit</span>
                         )}
                        <Button 
                            onClick={submitSolution}
                            disabled={submissionStatus === 'submitting'}
                            className="bg-primary-600 hover:bg-primary-700"
                        >
                            {submissionStatus === 'submitting' ? 'Submitting...' : 'Submit Solution'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TakeCodingRound;
