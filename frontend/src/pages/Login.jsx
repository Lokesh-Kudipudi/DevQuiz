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
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
            {/* Centered card */}
            <div className="relative z-10 w-full max-w-[400px] animate-[fadeUp_0.3s_ease_forwards]">
                {/* Logo mark */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#7fff6e] mb-5">
                        <span className="font-['Syne',sans-serif] font-extrabold text-2xl text-[#0a0a0f]">D</span>
                    </div>
                    <h1 className="font-['Syne',sans-serif] font-extrabold text-5xl tracking-[-2px] text-[#f0f0f5] mb-2">
                        DevQuiz
                    </h1>
                    <p className="text-[#6b6b80] text-xs font-mono tracking-wide">
                        Master development skills, one quiz at a time.
                    </p>
                </div>

                {/* Login card */}
                <div className="bg-[#111118] border border-white/[0.07] rounded-[12px] p-8">
                    {/* Google sign-in */}
                    <button
                        onClick={login}
                        className="w-full bg-white hover:bg-gray-100 text-gray-900 font-mono font-medium text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-150 hover:-translate-y-px cursor-pointer border-0"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5 flex-shrink-0"
                        />
                        Sign in with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-white/[0.07]" />
                        <span className="text-[10px] uppercase tracking-[2px] text-[#6b6b80] font-mono">Note</span>
                        <div className="flex-1 h-px bg-white/[0.07]" />
                    </div>

                    {/* Browser note */}
                    <div className="px-4 py-3.5 bg-[#ffcc44]/[0.06] border border-[#ffcc44]/[0.15] rounded-lg">
                        <p className="text-[11px] text-[#ffcc44] font-mono font-medium mb-2">Browser Configuration</p>
                        <ul className="text-[11px] text-[#6b6b80] font-mono space-y-1 list-disc list-inside">
                            <li>Disable Shields <span className="opacity-60">(Brave)</span></li>
                            <li>Allow Third-Party Cookies <span className="opacity-60">(Chrome, Edge)</span></li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center mt-6 text-[10px] text-[#6b6b80] font-mono tracking-widest">
                    © 2026 DevQuiz. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
