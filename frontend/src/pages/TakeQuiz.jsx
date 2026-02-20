import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Button from '../components/ui/Button';
import QuizQuestion from '../components/quiz/QuizQuestion';

const TakeQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const { data } = await axios.get(`/api/quizzes/${id}`);
                setQuiz(data);
                
                if (data.attempt) {
                    navigate(`/quiz/${id}/results`, { replace: true });
                    return;
                }
                
                setAnswers(new Array(data.questions.length).fill(null));
            } catch (err) {
                console.error('Failed to load quiz');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id, navigate]);

    const handleOptionSelect = (option) => {
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
            await axios.post(`/api/quizzes/${id}/attempt`, { answers: filledAnswers });
            navigate(`/quiz/${id}/results`, { replace: true });
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

                <QuizQuestion 
                    question={currentQuestion}
                    selectedOption={currentAnswer?.selectedOption}
                    onOptionSelect={handleOptionSelect}
                />

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

