import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-xl font-bold text-indigo-400">DevQuiz</Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <div className="flex items-center space-x-2">
                                {user.avatar && (
                                    <img 
                                        src={user.avatar} 
                                        alt={user.name} 
                                        referrerPolicy="no-referrer"
                                        className="w-8 h-8 rounded-full border border-gray-600"
                                    />
                                )}
                                <span className="text-gray-300">Hello, {user.name}</span>
                            </div>
                            <button 
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/" className="text-gray-300 hover:text-white">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
