import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const CreateCodingRound = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [timeLimit, setTimeLimit] = useState(60);
    const [roundType, setRoundType] = useState('External'); // 'Piston' | 'External'
    const [allowSelfAttempt, setAllowSelfAttempt] = useState(false);

    // Piston specific state
    const [questions, setQuestions] = useState([
        { 
            title: '', 
            description: '', 
            difficulty: 'Easy', 
            topic: '', 
            starterCode: '// Write your code here',
            testCases: [{ input: '', expectedOutput: '', isHidden: false }] 
        }
    ]);
    
    // AI Generation State
    const [generationMode, setGenerationMode] = useState('manual'); // 'manual' | 'ai'
    const [aiTopic, setAiTopic] = useState('');
    const [aiDifficulty, setAiDifficulty] = useState('Medium');
    const [aiCount, setAiCount] = useState(3);
    const [generating, setGenerating] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleTestCaseChange = (qIndex, tIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].testCases[tIndex][field] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { 
            title: '', 
            description: '', 
            difficulty: 'Easy', 
            topic: '', 
            starterCode: '// Write your code here',
            testCases: [{ input: '', expectedOutput: '', isHidden: false }] 
        }]);
    };

    const addTestCase = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].testCases.push({ input: '', expectedOutput: '', isHidden: false });
        setQuestions(newQuestions);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            const newQuestions = questions.filter((_, i) => i !== index);
            setQuestions(newQuestions);
        }
    };

    const removeTestCase = (qIndex, tIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].testCases.length > 1) {
            newQuestions[qIndex].testCases = newQuestions[qIndex].testCases.filter((_, i) => i !== tIndex);
            setQuestions(newQuestions);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                title,
                groupId,
                timeLimit,
                type: roundType,
                allowSelfAttempt
            };

            if (roundType === 'Piston') {
                payload.questions = questions;
            }

            const { data } = await axios.post('/api/coding-rounds', payload);
            
            if (roundType === 'External') {
                navigate(`/coding-round/${data._id}/lobby`);
            } else {
                navigate(`/groups/${groupId}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create coding round');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        setError('');
        try {
            const { data } = await axios.post('/api/coding-rounds/generate', {
                topic: aiTopic,
                difficulty: aiDifficulty,
                count: aiCount
            });
            
            setQuestions(data);
            setGenerationMode('manual');
        } catch (err) {
            console.error(err);
            setError('Failed to generate questions. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <Card>
                    <h1 className="text-3xl font-bold text-white mb-6">Create Coding Round</h1>
                    
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Round Type Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div 
                                className="cursor-not-allowed p-4 rounded-xl border-2 border-gray-800 bg-gray-900/50 opacity-50"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-500">
                                        Self-Hosted (Piston)
                                    </h3>
                                    <span className="text-[10px] uppercase font-bold bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">
                                        Coming Soon
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Code runs on our server. Feature currently under development.
                                </p>
                            </div>

                            <div 
                                onClick={() => setRoundType('External')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                                    roundType === 'External' 
                                        ? 'border-purple-500 bg-purple-900/20' 
                                        : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                                }`}
                            >
                                <h3 className={`font-bold text-lg mb-2 ${roundType === 'External' ? 'text-purple-400' : 'text-gray-300'}`}>
                                    External Platform & Timer
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Solve on LeetCode/CodeChef. Participants track time manually. collaborative question pool.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Round Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Weekly Contest 101"
                                required
                            />
                            <Input
                                label="Time Limit (minutes)"
                                type="number"
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                                min="1"
                                required
                            />
                        </div>

                        {roundType === 'External' && (
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={allowSelfAttempt}
                                        onChange={(e) => setAllowSelfAttempt(e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-600 bg-gray-700 focus:ring-purple-500"
                                    />
                                    <div>
                                        <span className="text-white font-medium">Allow Self Attempt</span>
                                        <p className="text-sm text-gray-400">If checked, creators can attempt their own questions (points will count).</p>
                                    </div>
                                </label>
                            </div>
                        )}

                        <div className="border-t border-gray-700 my-8 pt-6"></div>

                        {roundType === 'Piston' && (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-white">Questions</h2>
                                    <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                                        <button
                                            type="button"
                                            onClick={() => setGenerationMode('manual')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                                generationMode === 'manual' 
                                                    ? 'bg-primary-600 text-white shadow-lg' 
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Manual Creation
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setGenerationMode('ai')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                                generationMode === 'ai' 
                                                    ? 'bg-purple-600 text-white shadow-lg' 
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            ✨ Generate with AI
                                        </button>
                                    </div>
                                </div>

                                {generationMode === 'ai' ? (
                                    <div className="bg-gradient-to-br from-purple-900/20 to-gray-900 border border-purple-500/30 rounded-xl p-8 text-center space-y-6">
                                        <div className="max-w-md mx-auto space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2 text-left">Topic</label>
                                                <input
                                                    type="text"
                                                    value={aiTopic}
                                                    onChange={(e) => setAiTopic(e.target.value)}
                                                    placeholder="e.g. Dynamic Programming, Graphs"
                                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2 text-left">Difficulty</label>
                                                    <select
                                                        value={aiDifficulty}
                                                        onChange={(e) => setAiDifficulty(e.target.value)}
                                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                                                    >
                                                        <option value="Easy">Easy</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="Hard">Hard</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2 text-left">Count</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="5"
                                                        value={aiCount}
                                                        onChange={(e) => setAiCount(parseInt(e.target.value))}
                                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            <Button 
                                                type="button" 
                                                onClick={handleGenerate} 
                                                disabled={generating}
                                                className="w-full bg-purple-600 hover:bg-purple-700 mt-4 h-12 text-lg"
                                            >
                                                {generating ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Generating Magic...
                                                    </span>
                                                ) : 'Generate Questions ✨'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {questions.map((question, qIndex) => (
                                            <div key={qIndex} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="text-lg font-medium text-primary-400">Question {qIndex + 1}</h3>
                                                    {questions.length > 1 && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeQuestion(qIndex)}
                                                            className="text-red-400 hover:text-red-300 text-sm"
                                                        >
                                                            Remove Question
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <Input
                                                        label="Title"
                                                        value={question.title}
                                                        onChange={(e) => handleQuestionChange(qIndex, 'title', e.target.value)}
                                                        placeholder="e.g., Two Sum"
                                                        required
                                                    />
                                                    <div className="space-y-1">
                                                        <label className="block text-sm font-medium text-gray-400">Difficulty</label>
                                                        <select
                                                            value={question.difficulty}
                                                            onChange={(e) => handleQuestionChange(qIndex, 'difficulty', e.target.value)}
                                                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                                                        >
                                                            <option value="Easy">Easy</option>
                                                            <option value="Medium">Medium</option>
                                                            <option value="Hard">Hard</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <Input
                                                    label="Topic"
                                                    value={question.topic}
                                                    onChange={(e) => handleQuestionChange(qIndex, 'topic', e.target.value)}
                                                    placeholder="e.g., Arrays, Hash Map"
                                                    required
                                                    className="mb-4"
                                                />

                                                <div className="space-y-1 mb-4">
                                                    <label className="block text-sm font-medium text-gray-400">Description</label>
                                                    <textarea
                                                        value={question.description}
                                                        onChange={(e) => handleQuestionChange(qIndex, 'description', e.target.value)}
                                                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500 min-h-[100px]"
                                                        placeholder="Problem description..."
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-1 mb-4">
                                                    <label className="block text-sm font-medium text-gray-400">Starter Code (JavaScript)</label>
                                                    <textarea
                                                        value={question.starterCode}
                                                        onChange={(e) => handleQuestionChange(qIndex, 'starterCode', e.target.value)}
                                                        className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-gray-300 font-mono text-sm focus:outline-none focus:border-primary-500 min-h-[100px]"
                                                        placeholder="function solution(args) { ... }"
                                                        required
                                                    />
                                                </div>

                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">Test Cases</label>
                                                    {question.testCases.map((testCase, tIndex) => (
                                                        <div key={tIndex} className="flex gap-4 mb-2 items-start">
                                                            <div className="flex-1">
                                                                <input
                                                                    type="text"
                                                                    value={testCase.input}
                                                                    onChange={(e) => handleTestCaseChange(qIndex, tIndex, 'input', e.target.value)}
                                                                    placeholder="Input (e.g. 2, 3)"
                                                                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <input
                                                                    type="text"
                                                                    value={testCase.expectedOutput}
                                                                    onChange={(e) => handleTestCaseChange(qIndex, tIndex, 'expectedOutput', e.target.value)}
                                                                    placeholder="Expected Output (e.g. 5)"
                                                                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="w-24 pt-2">
                                                                <label className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={testCase.isHidden}
                                                                        onChange={(e) => handleTestCaseChange(qIndex, tIndex, 'isHidden', e.target.checked)}
                                                                        className="form-checkbox bg-gray-900 border-gray-700 text-primary-500 rounded"
                                                                    />
                                                                    <span>Hidden</span>
                                                                </label>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeTestCase(qIndex, tIndex)}
                                                                className="text-gray-500 hover:text-red-400 pt-2"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => addTestCase(qIndex)}
                                                        className="text-sm text-primary-400 hover:text-primary-300 mt-1"
                                                    >
                                                        + Add Test Case
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex justify-center mb-8">
                                            <Button type="button" onClick={addQuestion} variant="secondary" className="w-full md:w-auto">
                                                + Add Another Question
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="flex justify-end pt-6 border-t border-gray-700">
                            <Button type="submit" disabled={loading} className="w-full md:w-auto">
                                {loading ? 'Creating...' : (roundType === 'External' ? 'Create Lobby' : 'Create Coding Round')}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default CreateCodingRound;
