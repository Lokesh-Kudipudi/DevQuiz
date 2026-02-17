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
            </div>
        </div>
    );
};

export default Login;
