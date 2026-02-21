import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GroupDetails from './pages/GroupDetails';
import CreateQuiz from './pages/CreateQuiz';
import CreateCodingRound from './pages/CreateCodingRound';
import CodingRoundLobby from './pages/CodingRoundLobby';
import LiveCodingRound from './pages/LiveCodingRound';
import CodingRoundResults from './pages/CodingRoundResults';
import TakeCodingRound from './pages/TakeCodingRound';
import TakeQuiz from './pages/TakeQuiz';
import QuizResults from './pages/QuizResults';
import CreateOA from './pages/CreateOA';
import TakeOA from './pages/TakeOA';
import OAResults from './pages/OAResults';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#111118',
                color: '#f0f0f5',
                border: '1px solid rgba(255,255,255,0.07)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/groups/:id" element={<GroupDetails />} />
              <Route path="/groups/:groupId/create-quiz" element={<CreateQuiz />} />
              <Route path="/groups/:groupId/create-coding-round" element={<CreateCodingRound />} />
              <Route path="/coding-round/:id" element={<TakeCodingRound />} />
              <Route path="/coding-round/:id/lobby" element={<CodingRoundLobby />} />
              <Route path="/coding-round/:id/live" element={<LiveCodingRound />} />
              <Route path="/coding-round/:id/results" element={<CodingRoundResults />} />
              <Route path="/quiz/:id" element={<TakeQuiz />} />
              <Route path="/quiz/:id/results" element={<QuizResults />} />
              <Route path="/groups/:groupId/create-oa" element={<CreateOA />} />
              <Route path="/oa/:id" element={<TakeOA />} />
              <Route path="/oa/:id/results" element={<OAResults />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
