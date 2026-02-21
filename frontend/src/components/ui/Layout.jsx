import Navbar from '../Navbar';

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
          className="text-center py-6 text-[10px] tracking-widest font-mono border-t border-white/[0.07]"
          style={{ color: 'var(--color-muted)' }}
        >
          © 2026 DevQuiz. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
