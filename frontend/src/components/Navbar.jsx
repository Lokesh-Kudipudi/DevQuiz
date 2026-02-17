import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-gray-950/70 backdrop-blur-xl border-b border-gray-800/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/dashboard" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all duration-300">
                            D
                        </div>
                        <span className="text-xl font-display font-bold text-white tracking-tight group-hover:text-primary-400 transition-colors">DevQuiz</span>
                    </Link>
                    
                    <div className="flex items-center space-x-6">
                        {user ? (
                            <>
                                <div className="hidden md:flex items-center space-x-3 bg-gray-800/50 rounded-full pl-1 pr-4 py-1 border border-gray-700/50">
                                    {user.avatar ? (
                                        <img 
                                            src={user.avatar} 
                                            alt={user.name} 
                                            referrerPolicy="no-referrer"
                                            className="w-8 h-8 rounded-full border border-gray-600"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary-900/50 text-primary-300 flex items-center justify-center text-xs font-bold border border-primary-500/30">
                                            {user.name?.charAt(0)}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-300">{user.name}</span>
                                </div>
                                <button 
                                    onClick={logout}
                                    className="text-gray-400 hover:text-white transition-colors text-sm font-medium hover:underline decoration-primary-500 decoration-2 underline-offset-4"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
