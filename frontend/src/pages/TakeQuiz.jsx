import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import QuestionDisplay from '../components/ui/QuestionDisplay';
import Button from '../components/ui/Button';

const TakeQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [score, setScore] = useState(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const { data } = await axios.get(`/api/quizzes/${id}`);
                setQuiz(data);
                
                if (data.attempt) {
                    setScore(data.attempt.score);
                    setTotal(data.questions.length); // Assuming questions length is total
                    // reconstruct answers/review state if needed, or just use data.attempt
                } else {
                    setAnswers(new Array(data.questions.length).fill(null));
                }
            } catch (err) {
                console.error('Failed to load quiz');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleOptionSelect = (option) => {
        if (score !== null) return; // Prevent changing answers if already submitted
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = {
            questionIndex: currentQuestionIndex,
            selectedOption: option
        };
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const filledAnswers = answers.map((ans, index) => ans || { questionIndex: index, selectedOption: '' });
            const { data } = await axios.post(`/api/quizzes/${id}/attempt`, { answers: filledAnswers });
            
            // Refetch to get the full attempt object with proper structure if needed, or just update local state
            setScore(data.score);
            setTotal(data.total);
            // Updating quiz state to include the new attempt so UI switches to review mode
            setQuiz(prev => ({ ...prev, attempt: { score: data.score, answers: data.processedAnswers } }));
        } catch (err) {
            console.error('Failed to submit quiz');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        </Layout>
    );
    
    if (!quiz) return (
        <Layout>
            <div className="text-center mt-20 text-gray-400">Quiz not found</div>
        </Layout>
    );

    // REVIEW MODE / COMPLETED QUIZ
    if (score !== null || quiz.attempt) {
        const attempt = quiz.attempt || { score, answers: [] }; // Fallback handling
        const userAnswers = attempt.answers || []; // Array of { questionIndex, selectedOption, isCorrect }
        const percentage = Math.round(((score !== null ? score : attempt.score) / quiz.questions.length) * 100);

        return (
            <Layout>
                <div className="max-w-3xl mx-auto">
                    <Card className="text-center mb-8 border-primary-500/20 bg-gradient-to-br from-gray-800 to-gray-900/50">
                        <h2 className="text-3xl font-bold mb-2 text-white">Quiz Results</h2>
                        <p className="text-gray-400 mb-8">Great job on completing the quiz!</p>
                        
                        <div className="flex justify-center items-center mb-8">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#1f2937"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke={percentage >= 70 ? "#10b981" : percentage >= 40 ? "#fbbf24" : "#ef4444"}
                                        strokeWidth="3"
                                        strokeDasharray={`${percentage}, 100`}
                                        className="animate-[spin_1s_ease-out_reverse]"
                                    />
                                </svg>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <span className="text-4xl font-bold text-white">{percentage}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-xl mb-8">
                            You scored <span className="font-bold text-primary-400">{score !== null ? score : attempt.score}</span> out of <span className="font-bold text-white">{quiz.questions.length}</span>
                        </div>
                        
                        <div className="flex justify-center space-x-4">
                            <Button 
                                onClick={() => navigate(`/groups/${quiz.group._id || quiz.group}`)}
                                variant="secondary"
                            >
                                Back to Group
                            </Button>
                            <Button 
                                onClick={() => navigate(`/quiz/${id}/results`)}
                            >
                                View Leaderboard
                            </Button>
                        </div>
                    </Card>

                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
                        <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Review Solutions
                    </h3>
                    
                    <div className="space-y-6 pb-10">
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
                </div>
            </Layout>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex];
    const progress = Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100);

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                        <span className={`font-semibold ${
                            quiz.difficulty === 'Easy' ? 'text-green-400' : 
                            quiz.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                        }`}>{quiz.difficulty}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-primary-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <Card className="mb-8 min-h-[400px] flex flex-col">
                    <div className="mb-8 text-white">
                        <QuestionDisplay content={currentQuestion.question} />
                    </div>
                    
                    <div className="space-y-3 flex-grow">
                        {currentQuestion.options.map((option, idx) => (
                            <div 
                                key={idx}
                                onClick={() => handleOptionSelect(option)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center ${
                                    currentAnswer?.selectedOption === option 
                                        ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-500/20' 
                                        : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-500 text-gray-300'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-full border mr-4 flex items-center justify-center ${
                                    currentAnswer?.selectedOption === option 
                                        ? 'border-white bg-white text-primary-600' 
                                        : 'border-gray-500'
                                }`}>
                                    {currentAnswer?.selectedOption === option && <div className="w-2.5 h-2.5 rounded-full bg-current"></div>}
                                </div>
                                {option}
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="flex justify-between">
                    <Button 
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        variant="secondary"
                    >
                        Previous
                    </Button>
                    
                    {currentQuestionIndex === quiz.questions.length - 1 ? (
                        <Button 
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                        >
                            {submitting ? 'Submitting...' : 'Submit Quiz'}
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default TakeQuiz;
