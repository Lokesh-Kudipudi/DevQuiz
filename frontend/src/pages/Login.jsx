import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
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
        <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/40 via-gray-950 to-gray-950 text-white p-4">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            
            <Card className="max-w-md w-full relative z-10 border-primary-500/20 shadow-2xl shadow-primary-500/10">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-primary-300 to-primary-100 bg-clip-text text-transparent">DevQuiz</h1>
                    <p className="text-gray-400 text-lg">Master development skills, one quiz at a time.</p>
                </div>
                
                <button 
                    onClick={login}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg group"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="font-sans">Sign in with Google</span>
                </button>
                
                <div className="mt-8">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-yellow-400 font-medium text-sm mb-1">Browser Configuration</h3>
                                <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                                    <li>Disable Shields <span className="text-gray-500 text-xs">(Brave)</span></li>
                                    <li>Allow Third-Party Cookies <span className="text-gray-500 text-xs">(Chrome, Edge)</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Login;
