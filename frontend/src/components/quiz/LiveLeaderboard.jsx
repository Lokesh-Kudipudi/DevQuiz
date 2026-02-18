import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const LiveLeaderboard = ({ roundId, currentUserId, questions = [], initialParticipants = [] }) => {
    const [leaderboard, setLeaderboard] = useState(initialParticipants);
    const [socket, setSocket] = useState(null);

    const getUniqueParticipants = (participants) => {
        if (!participants) return [];
        const seen = new Set();
        return participants.filter(p => {
            const id = p.user._id || p.user;
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    };

    // Initial load
    useEffect(() => {
        if (initialParticipants && initialParticipants.length > 0) {
            const unique = getUniqueParticipants(initialParticipants);
            setLeaderboard(unique.sort((a, b) => b.score - a.score));
        }
    }, [initialParticipants]);

    useEffect(() => {
        // Connect to Socket.io server
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5174');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            newSocket.emit('join_round', roundId);
        });

        newSocket.on('leaderboard_update', (data) => {
            console.log('Leaderboard update:', data);
            const unique = getUniqueParticipants(data.leaderboard);
            setLeaderboard(unique);
        });

        newSocket.on('round_ended', () => {
             alert('The round has been ended by the host.');
             window.location.href = `/coding-round/${roundId}/results`;
        });

        return () => {
             newSocket.disconnect();
        };
    }, [roundId]);

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-900/50 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-white flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                    Live Leaderboard
                </h3>
                <span className="text-xs text-gray-400">{leaderboard.length} Participants</span>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto">
                {leaderboard.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 italic text-sm">
                        Waiting for submissions...
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-800 text-gray-400">
                            <tr>
                                <th className="px-4 py-2 font-medium">Rank</th>
                                <th className="px-4 py-2 font-medium">User</th>
                                {questions.map((q, idx) => (
                                    <th key={q._id} className="px-4 py-2 font-medium text-center">
                                        Q{idx + 1}
                                    </th>
                                ))}
                                <th className="px-4 py-2 font-medium text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {leaderboard.map((participant, index) => {
                                const isCurrentUser = participant.user._id === currentUserId || participant.user === currentUserId;
                                return (
                                    <tr key={`${participant.user._id || participant.user}-${index}`} className={isCurrentUser ? 'bg-primary-900/20' : ''}>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-300 w-12">
                                            {index + 1}
                                            {index === 0 && <span className="ml-1 text-yellow-400">👑</span>}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap font-medium text-white">
                                            {participant.user.name || 'Unknown'}
                                            {isCurrentUser && <span className="ml-2 text-xs text-primary-400">(You)</span>}
                                        </td>
                                        {questions.map(q => {
                                            const statusList = participant.status || participant.questionStatus || [];
                                            const status = statusList.find(s => s.questionId === q._id);
                                            return (
                                                <td key={q._id} className="px-4 py-2 text-center border-l border-gray-700">
                                                     {status && status.status === 'Passed' ? (
                                                         <div className="flex flex-col">
                                                             <span className="text-green-400 font-bold">✓</span>
                                                             {status.timeTaken && (
                                                                 <span className="text-[10px] text-gray-500">
                                                                     {Math.floor(status.timeTaken)}s
                                                                 </span>
                                                             )}
                                                         </div>
                                                     ) : (
                                                         <span className="text-gray-600">-</span>
                                                     )}
                                                </td>
                                            );
                                        })}
                                        <td className="px-4 py-2 whitespace-nowrap text-right text-primary-300 font-bold">
                                            {participant.score}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default LiveLeaderboard;
