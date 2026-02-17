import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GroupDetails from './pages/GroupDetails';
import CreateQuiz from './pages/CreateQuiz';
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
            <Route path="/quiz/:id" element={<TakeQuiz />} />
            <Route path="/quiz/:id/results" element={<QuizResults />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
