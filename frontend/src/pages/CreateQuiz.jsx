import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const CreateQuiz = () => {
    const { groupId } = useParams(); // Need to ensure route structure passes groupId
    const navigate = useNavigate();
    
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [count, setCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('/api/quizzes/generate', {
                topic,
                difficulty,
                count,
                groupId
            });
            navigate(`/groups/${groupId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-indigo-400">Generate Quiz</h2>
                {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Topic</label>
                        <input 
                            type="text" 
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. React Hooks, Python Basics"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Difficulty</label>
                        <select 
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2">Number of Questions</label>
                        <input 
                            type="number" 
                            min="1"
                            max="20"
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <button 
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 text-gray-400 hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-3 rounded bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                'Generate Quiz'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateQuiz;
