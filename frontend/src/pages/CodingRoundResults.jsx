import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';

const CodingRoundResults = () => {
    const { id } = useParams();
    const [round, setRound] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRound = async () => {
            try {
                const { data } = await axios.get(`/api/coding-rounds/${id}`);
                setRound(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load results');
            } finally {
                setLoading(false);
            }
        };

        fetchRound();
    }, [id]);

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        </Layout>
    );

    if (error) return <Layout>{error}</Layout>;
    if (!round) return <Layout>Round not found</Layout>;

    // Sort participants by score (desc) then time (asc - if we had total time)
    // For now, just score.
    const sortedParticipants = [...round.participants].sort((a, b) => b.score - a.score);

    return (
        <Layout>
            <Link to={`/groups/${round.group._id || round.group}`} className="text-gray-400 hover:text-primary-400 mb-6 inline-flex items-center transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Group
            </Link>

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2">{round.title} Results</h1>
                    <p className="text-gray-400">
                        Status: <span className={round.status === 'Live' ? 'text-green-400' : 'text-gray-300'}>{round.status}</span>
                    </p>
                </div>

                <Card className="overflow-hidden p-0 border-primary-500/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs font-medium tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Rank</th>
                                    <th className="px-6 py-4">Participant</th>
                                    <th className="px-6 py-4 text-center">Score</th>
                                    <th className="px-6 py-4 text-center">Solved</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {sortedParticipants.map((p, index) => {
                                    let rankClass = "bg-gray-800 text-gray-400";
                                    let rankIcon = null;
                                    
                                    if (index === 0) {
                                        rankClass = "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
                                        rankIcon = "👑";
                                    } else if (index === 1) {
                                        rankClass = "bg-gray-300/20 text-gray-300 border border-gray-400/30";
                                        rankIcon = "🥈";
                                    } else if (index === 2) {
                                        rankClass = "bg-orange-700/20 text-orange-400 border border-orange-600/30";
                                        rankIcon = "🥉";
                                    }

                                    const solvedCount = p.questionStatus?.filter(qs => qs.status === 'Passed').length || 0;

                                    return (
                                        <tr key={p.user._id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rankClass}`}>
                                                    {rankIcon || index + 1}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-300 font-bold border border-primary-500/30">
                                                        {p.user.name?.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-white">
                                                            {p.user.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 bg-primary-900/30 text-primary-300 rounded-full text-sm font-bold border border-primary-500/20">
                                                    {p.score} pts
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-400">
                                                {solvedCount} / {round.questions.length}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default CodingRoundResults;
