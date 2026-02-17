import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const LiveLeaderboard = ({ roundId, currentUserId }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [socket, setSocket] = useState(null);

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
            setLeaderboard(data.leaderboard);
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
                                <th className="px-4 py-2 font-medium text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {leaderboard.map((participant, index) => {
                                const isCurrentUser = participant.user._id === currentUserId || participant.user === currentUserId;
                                return (
                                    <tr key={participant.user._id || index} className={isCurrentUser ? 'bg-primary-900/20' : ''}>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-300 w-12">
                                            {index + 1}
                                            {index === 0 && <span className="ml-1 text-yellow-400">👑</span>}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap font-medium text-white">
                                            {participant.user.name || 'Unknown'}
                                            {isCurrentUser && <span className="ml-2 text-xs text-primary-400">(You)</span>}
                                        </td>
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
