import React from 'react';
import Navbar from '../Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-primary-500/30 selection:text-primary-200">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-gray-950 to-gray-950 pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-800/50 bg-gray-950/50 backdrop-blur-sm py-8">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} DevQuiz. All rights reserved.</p>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
