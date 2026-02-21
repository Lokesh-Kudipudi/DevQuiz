import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  NAVBAR_STYLES,
  NAVBAR_LOGO_MARK_STYLES,
  NAVBAR_LOGO_TEXT_STYLES,
  NAVBAR_USER_CHIP_STYLES,
} from '../constants/ui';

/* Sun icon */
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

/* Moon icon */
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={NAVBAR_STYLES}>
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2.5 no-underline">
        <div className={NAVBAR_LOGO_MARK_STYLES}>D</div>
        <span className={NAVBAR_LOGO_TEXT_STYLES}>DevQuiz</span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-white/[0.07] text-[#6b6b80] hover:border-white/[0.14] hover:text-[#f0f0f5] transition-all cursor-pointer bg-transparent"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {user ? (
          <>
            {/* User chip */}
            <div className={NAVBAR_USER_CHIP_STYLES}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#9b6dff] flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <span>{user.name}</span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="bg-transparent border border-white/[0.07] rounded-lg px-4 py-1.5 text-[#6b6b80] text-xs font-mono hover:border-white/[0.14] hover:text-[#f0f0f5] transition-all cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/" className="text-[#6b6b80] hover:text-[#f0f0f5] text-xs font-mono transition-colors">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
