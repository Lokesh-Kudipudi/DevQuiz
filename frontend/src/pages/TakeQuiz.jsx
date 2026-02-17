import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

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

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
    if (!quiz) return <div className="text-white text-center mt-20">Quiz not found</div>;

    // REVIEW MODE / COMPLETED QUIZ
    if (score !== null || quiz.attempt) {
        const attempt = quiz.attempt || { score, answers: [] }; // Fallback handling
        const userAnswers = attempt.answers || []; // Array of { questionIndex, selectedOption, isCorrect }

        return (
            <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
                <div className="w-full max-w-3xl">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center mb-8">
                        <h2 className="text-3xl font-bold mb-4 text-indigo-400">Quiz Results</h2>
                        <div className="text-5xl font-bold text-green-400 mb-6">
                            {score !== null ? score : attempt.score} <span className="text-2xl text-gray-500">/ {quiz.questions.length}</span>
                        </div>
                        <button 
                            onClick={() => navigate(`/groups/${quiz.group._id || quiz.group}`)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-bold"
                        >
                            Back to Group
                        </button>
                    </div>

                    <h3 className="text-2xl font-bold mb-6 text-gray-300">Review Solutions</h3>
                    
                    <div className="space-y-6">
                        {quiz.questions.map((q, qIdx) => {
                            const userAnsObj = userAnswers.find(a => a.questionIndex === qIdx);
                            const userSelected = userAnsObj?.selectedOption;
                            const isCorrect = userAnsObj?.isCorrect;

                            return (
                                <div key={qIdx} className="bg-gray-800 p-6 rounded-lg shadow-md">
                                    <h4 className="text-lg font-bold mb-4">
                                        {qIdx + 1}. {q.question}
                                    </h4>
                                    <div className="space-y-2">
                                        {q.options.map((opt, optIdx) => {
                                            let optionClass = "p-3 rounded border bg-gray-700 border-gray-600";
                                            
                                            // Highlight logic
                                            if (opt === q.correctAnswer) {
                                                optionClass = "p-3 rounded border bg-green-900/50 border-green-500 text-green-200"; // Correct Answer
                                            } else if (opt === userSelected && !isCorrect) {
                                                optionClass = "p-3 rounded border bg-red-900/50 border-red-500 text-red-200"; // Wrong Selection
                                            }

                                            return (
                                                <div key={optIdx} className={optionClass}>
                                                    <div className="flex justify-between items-center">
                                                        <span>{opt}</span>
                                                        {opt === q.correctAnswer && <span className="text-green-400 text-sm font-bold">✓ Correct Answer</span>}
                                                        {opt === userSelected && opt !== q.correctAnswer && <span className="text-red-400 text-sm font-bold">✗ Your Answer</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400">Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                        <span className="text-indigo-400 font-semibold">{quiz.difficulty}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-6">{currentQuestion.question}</h2>
                    
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, idx) => (
                            <div 
                                key={idx}
                                onClick={() => handleOptionSelect(option)}
                                className={`p-4 rounded border cursor-pointer transition ${
                                    currentAnswer?.selectedOption === option 
                                        ? 'bg-indigo-600 border-indigo-500' 
                                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                }`}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between">
                    <button 
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white"
                    >
                        Previous
                    </button>
                    
                    {currentQuestionIndex === quiz.questions.length - 1 ? (
                        <button 
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-bold"
                        >
                            {submitting ? 'Submitting...' : 'Submit Quiz'}
                        </button>
                    ) : (
                        <button 
                            onClick={handleNext}
                            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TakeQuiz;
