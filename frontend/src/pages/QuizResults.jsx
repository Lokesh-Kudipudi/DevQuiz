
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';

const QuizResults = () => {
    const { id } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const { data } = await axios.get(`/api/quizzes/${id}/results`);
                setResults(data);
            } catch (err) {
                setError('Failed to load quiz results');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [id]);

    if (loading) return <div className="text-white text-center mt-20">Loading results...</div>;
    if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <Link to={`/dashboard`} className="text-gray-400 hover:text-white mb-4 inline-block">&larr; Back to Dashboard</Link>

            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-indigo-400 mb-2">Quiz Results</h1>
                    <p className="text-gray-400">See how everyone performed!</p>
                </header>

                <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    {results.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            No attempts found for this quiz yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Rank</th>
                                        <th className="px-6 py-4">Participant</th>
                                        <th className="px-6 py-4 text-center">Score</th>
                                        <th className="px-6 py-4 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {results.map((result, index) => (
                                        <tr key={index} className="hover:bg-gray-750 transition">
                                            <td className="px-6 py-4 font-mono text-gray-400">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="font-medium text-white">
                                                        {result.user?.name || 'Unknown User'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block px-3 py-1 bg-indigo-900 text-indigo-200 rounded-full text-sm font-bold">
                                                    {result.score}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-400 text-sm">
                                                {new Date(result.attemptedAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizResults;
