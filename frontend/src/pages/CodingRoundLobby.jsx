import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const CodingRoundLobby = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [round, setRound] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingQuestion, setAddingQuestion] = useState(false);
    const [error, setError] = useState('');
    const [socket, setSocket] = useState(null);

    // Question form state
    const [qTitle, setQTitle] = useState('');
    const [qUrl, setQUrl] = useState('');
    const [qPlatform, setQPlatform] = useState('LeetCode');
    const [qDifficulty, setQDifficulty] = useState('Medium');
    const [qPoints, setQPoints] = useState(3);

    useEffect(() => {
        fetchRound();
        
        // Setup socket listener
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5174');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            newSocket.emit('join_round', id);
        });

        newSocket.on('question_added', (data) => {
            console.log('New question added:', data);
            // Optimistically add question or cleaner to refetch if we need full object populated
            // Backend sends { message, question } but question might need population if we show addedBy name
            // For now, let's just refetch to be safe and simple
            fetchRound();
        });

        newSocket.on('round_started', () => {
             console.log('Round started!');
             navigate(`/coding-round/${id}/live`);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [id]);

    const fetchRound = async () => {
        try {
            const { data } = await axios.get(`/api/coding-rounds/${id}`);
            setRound(data);
            if (data.status === 'Live') {
                navigate(`/coding-round/${id}/live`);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load round details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        setAddingQuestion(true);
        setError('');

        try {
            await axios.post(`/api/coding-rounds/${id}/questions`, {
                title: qTitle,
                url: qUrl,
                platform: qPlatform,
                difficulty: qDifficulty,
                points: parseInt(qPoints)
            });
            
            // Reset form
            setQTitle('');
            setQUrl('');
            setQPoints(3);
            
            // Refresh round data (optimistic update would be better with socket)
            fetchRound();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add question');
        } finally {
            setAddingQuestion(false);
        }
    };

    const handleStartRound = async () => {
        try {
            await axios.post(`/api/coding-rounds/${id}/start`);
            navigate(`/coding-round/${id}/live`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to start round');
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

    const isCreator = (round.creator?._id || round.creator) === user?._id;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6">
                 {/* Header & Controls */}
                <Card>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{round.title}</h1>
                            <div className="flex items-center gap-4 text-gray-400 text-sm">
                                <span>Host: {user?._id === (round.creator._id || round.creator) ? 'You' : (round.creator.name || 'Admin')}</span>
                                <span>•</span>
                                <span>Time Limit: {round.timeLimit} mins</span>
                                <span>•</span>
                                <span className="text-yellow-400">Status: Lobby (Waiting to start)</span>
                            </div>
                        </div>
                        {isCreator && (
                            <Button 
                                onClick={handleStartRound}
                                className="bg-green-600 hover:bg-green-700 font-bold px-8"
                            >
                                START ROUND 🚀
                            </Button>
                        )}
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add Question Form */}
                    <div className="md:col-span-1">
                        <Card className="h-full">
                            <h2 className="text-xl font-bold text-white mb-4">Add a Question</h2>
                            <p className="text-sm text-gray-400 mb-6">
                                Contribute a challenge from an external platform. 
                            </p>
                            
                            {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

                            <form onSubmit={handleAddQuestion} className="space-y-4">
                                <Input
                                    label="Question Title"
                                    value={qTitle}
                                    onChange={(e) => setQTitle(e.target.value)}
                                    placeholder="e.g. Reverse Linked List"
                                    required
                                />
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-400">Platform</label>
                                    <select
                                        value={qPlatform}
                                        onChange={(e) => setQPlatform(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                                    >
                                        <option value="LeetCode">LeetCode</option>
                                        <option value="CodeChef">CodeChef</option>
                                        <option value="HackerRank">HackerRank</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <Input
                                    label="Problem URL"
                                    value={qUrl}
                                    onChange={(e) => setQUrl(e.target.value)}
                                    placeholder="https://leetcode.com/..."
                                    required
                                />
                                <div className="grid grid-cols-2 gap-2">
                                     <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-400">Difficulty</label>
                                        <select
                                            value={qDifficulty}
                                            onChange={(e) => setQDifficulty(e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                    <Input
                                        label="Points (1-5)"
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={qPoints}
                                        onChange={(e) => setQPoints(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={addingQuestion}
                                    className="w-full mt-4"
                                >
                                    {addingQuestion ? 'Adding...' : 'Add to Pool'}
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {/* Questions Pool List */}
                    <div className="md:col-span-2">
                        <Card className="h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Questions Pool</h2>
                                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                                    {round.questions.length} Questions
                                </span>
                            </div>

                            <div className="space-y-3">
                                {round.questions.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
                                        <p>No questions added yet.</p>
                                        <p className="text-sm mt-1">Be the first to add one!</p>
                                    </div>
                                ) : (
                                    round.questions.map((q, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`p-4 rounded-xl border flex items-center justify-between ${
                                                q.isSkeleton 
                                                    ? 'bg-gray-900/50 border-gray-800 opacity-75' 
                                                    : 'bg-gray-800 border-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-400">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h3 className={`font-bold ${q.title === 'Hidden Question' ? 'text-gray-500 italic' : 'text-gray-200'}`}>
                                                        {q.title}
                                                    </h3>
                                                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                                        {q.platform !== '?' && (
                                                            <span className="bg-gray-900 px-2 py-0.5 rounded text-gray-300 border border-gray-700">
                                                                {q.platform}
                                                            </span>
                                                        )}
                                                        <span>Added by {q.addedBy?.name || 'Unknown'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className={`font-bold text-lg ${
                                                    q.points > 3 ? 'text-yellow-400' : 'text-primary-400'
                                                }`}>
                                                    {q.points} pts
                                                </div>
                                                <div className={`text-xs font-bold uppercase ${
                                                    q.difficulty === 'Easy' ? 'text-green-500' :
                                                    q.difficulty === 'Medium' ? 'text-yellow-500' :
                                                    q.difficulty === 'Hard' ? 'text-red-500' : 'text-gray-600'
                                                }`}>
                                                    {q.difficulty}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CodingRoundLobby;
