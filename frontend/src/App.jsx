import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PersonalDashboard from './pages/PersonalDashboard';
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
import LegalPrivacyPage from './pages/LegalPrivacyPage';
import LegalTermsPage from './pages/LegalTermsPage';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text-base)',
                border: '1px solid rgba(255,255,255,0.07)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/legal/privacy" element={<LegalPrivacyPage />} />
            <Route path="/legal/terms" element={<LegalTermsPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/personal-dashboard" element={<PersonalDashboard />} />
              <Route path="/groups/:id" element={<GroupDetails />} />
              <Route path="/groups/:groupId/create-quiz" element={<CreateQuiz />} />
              <Route path="/solo/create-quiz" element={<CreateQuiz />} />
              <Route path="/groups/:groupId/create-coding-round" element={<CreateCodingRound />} />
              <Route path="/solo/create-coding-round" element={<CreateCodingRound />} />
              <Route path="/coding-round/:id" element={<TakeCodingRound />} />
              <Route path="/coding-round/:id/lobby" element={<CodingRoundLobby />} />
              <Route path="/coding-round/:id/live" element={<LiveCodingRound />} />
              <Route path="/coding-round/:id/results" element={<CodingRoundResults />} />
              <Route path="/quiz/:id" element={<TakeQuiz />} />
              <Route path="/quiz/:id/results" element={<QuizResults />} />
              <Route path="/groups/:groupId/create-oa" element={<CreateOA />} />
              <Route path="/solo/create-oa" element={<CreateOA />} />
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
