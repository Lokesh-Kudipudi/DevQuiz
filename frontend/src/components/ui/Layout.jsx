import Navbar from '../Navbar';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-base)', fontFamily: 'var(--font-mono)' }}>
      {/* Content sits above the body::before grid overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer
          className="text-center py-6 text-[10px] tracking-widest font-mono border-t border-[var(--color-text-base)]/[0.07]"
          style={{ color: 'var(--color-muted)' }}
        >
          <div className="flex items-center justify-center gap-4 mb-2">
            <Link to="/legal/privacy" className="hover:text-[var(--color-accent)] transition-colors">
              Privacy Policy
            </Link>
            <span className="opacity-50">|</span>
            <Link to="/legal/terms" className="hover:text-[var(--color-accent)] transition-colors">
              Terms & Conditions
            </Link>
          </div>
          <p>© 2026 DevQuiz. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
