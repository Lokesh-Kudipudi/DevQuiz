import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const CreateQuiz = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [count, setCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const promise = axios.post('/api/quizzes/generate', {
            topic,
            difficulty,
            count,
            groupId
        }).then(response => {
            window.dispatchEvent(new Event('group-content-updated'));
            return response;
        });

        toast.promise(
            promise,
            {
                loading: 'Generating your quiz with AI...',
                success: 'Quiz generated successfully!',
                error: (err) => err.response?.data?.message || 'Failed to generate quiz'
            }
        );

        navigate(`/groups/${groupId}`);
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <Card className="w-full max-w-md border-primary-500/20 shadow-2xl shadow-primary-500/10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-500/30">
                            <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Generate Quiz</h2>
                        <p className="text-gray-400">Create a new challenge for your group</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-start">
                            <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. React Hooks, Python Basics"
                            required
                        />

                        <div>
                            <label className="block text-gray-300 mb-2 font-medium">Difficulty</label>
                            <div className="relative">
                                <select 
                                    className="w-full p-3 pl-4 pr-10 rounded-xl bg-gray-900/50 text-white border border-gray-700/50 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none"
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2 font-medium">
                                Number of Questions: <span className="text-primary-400 font-bold">{count}</span>
                            </label>
                            <input 
                                type="range" 
                                min="1"
                                max="20"
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>1</span>
                                <span>10</span>
                                <span>20</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <Button 
                                type="button"
                                variant="ghost"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                loading={loading}
                                className="px-8"
                            >
                                Generate Quiz
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default CreateQuiz;
