import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Login = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                <h1 className="text-4xl font-bold mb-6 text-indigo-400">DevQuiz</h1>
                <p className="mb-8 text-gray-300">Join the developer community, take quizzes, and climb the leaderboard.</p>
                
                <button 
                    onClick={login}
                    className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-4 rounded flex items-center justify-center transition duration-300"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6 mr-3" />
                    Sign in with Google
                </button>
                
                <div className="mt-6 text-sm text-gray-400 bg-gray-700/50 p-4 rounded-md border border-gray-600 text-left">
                    <p className="font-medium text-yellow-400 mb-2">Note:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Disable Shields <span className="text-gray-500">(Brave)</span></li>
                        <li>Disable "Block Third-Party Cookies" <span className="text-gray-500">(Chrome, Edge)</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Login;
