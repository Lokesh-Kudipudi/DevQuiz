import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
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
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
