import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Button from '../components/ui/Button';
import StreakCard from '../components/dashboard/StreakCard';
import { BADGE_STYLES, SECTION_LABEL_STYLES } from '../constants/ui';

const PersonalDashboard = () => {
  const navigate = useNavigate();
  const [soloQuizzes, setSoloQuizzes] = useState([]);
  const [soloOAs, setSoloOAs] = useState([]);
  const [soloRounds, setSoloRounds] = useState([]);

  const fetchSoloItems = async () => {
    try {
      const [quizzesRes, oasRes, roundsRes] = await Promise.all([
        axios.get('/api/solo/quizzes'),
        axios.get('/api/solo/online-assessments'),
        axios.get('/api/solo/coding-rounds'),
      ]);
      setSoloQuizzes(quizzesRes.data || []);
      setSoloOAs(oasRes.data || []);
      setSoloRounds(roundsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch solo items', err);
    }
  };

  useEffect(() => {
    fetchSoloItems();
  }, []);

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`/api/quizzes/${quizId}`);
      toast.success('Quiz deleted');
      fetchSoloItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete quiz');
    }
  };

  const handleDeleteOA = async (oaId) => {
    try {
      await axios.delete(`/api/online-assessments/${oaId}`);
      toast.success('Assessment deleted');
      fetchSoloItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete assessment');
    }
  };

  const handleDeleteRound = async (roundId) => {
    try {
      await axios.delete(`/api/coding-rounds/${roundId}`);
      toast.success('Coding round deleted');
      fetchSoloItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete coding round');
    }
  };

  const totalItems = soloQuizzes.length + soloOAs.length + soloRounds.length;

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-8 py-12 animate-[fadeUp_0.3s_ease_forwards]">
        <Link
          to="/dashboard"
          className="text-[var(--color-muted)] hover:text-[var(--color-accent)] inline-flex items-center transition-colors mb-6"
        >
          ← Back to Dashboard
        </Link>

        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-['Syne',sans-serif] font-extrabold text-5xl tracking-[-2px] leading-none text-[var(--color-text-base)]">
              Personal Dashboard
            </h1>
            <p className="text-[var(--color-muted)] text-xs mt-2 tracking-wide font-mono">
              Solo practice, streaks, and recent attempts
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className={`${SECTION_LABEL_STYLES} mb-4`}>
            <span>Personal Practice</span>
            <span className={BADGE_STYLES}>{totalItems}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button onClick={() => navigate('/solo/create-quiz')}>Create Solo Quiz</Button>
            <Button variant="outline" onClick={() => navigate('/solo/create-oa')}>Create Solo OA</Button>
            <Button variant="outline" onClick={() => navigate('/solo/create-coding-round')}>Create Solo Coding Round</Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[var(--color-surface)] border border-[var(--color-text-base)]/[0.07] rounded-[12px] p-4">
              <p className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-wide mb-3">Quizzes</p>
              {soloQuizzes.slice(0, 8).map((quiz) => (
                <div
                  key={quiz._id}
                  className="py-2 border-b border-[var(--color-text-base)]/[0.07] last:border-0"
                >
                  <p className="text-sm text-[var(--color-text-base)] truncate">{quiz.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] font-mono text-[var(--color-muted)]">{quiz.attempt ? 'Attempted' : 'Not attempted'}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(quiz.attempt ? `/quiz/${quiz._id}/results` : `/quiz/${quiz._id}`)}
                        className="text-[10px] uppercase font-mono px-2 py-1 rounded border border-[var(--color-text-base)]/[0.12] hover:border-[var(--color-accent)] text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                      >
                        {quiz.attempt ? 'Results' : 'Start'}
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="text-[10px] uppercase font-mono px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {soloQuizzes.length === 0 && <p className="text-xs text-[var(--color-muted)] font-mono">No solo quizzes yet.</p>}
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-text-base)]/[0.07] rounded-[12px] p-4">
              <p className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-wide mb-3">Assessments</p>
              {soloOAs.slice(0, 8).map((oa) => (
                <div
                  key={oa._id}
                  className="py-2 border-b border-[var(--color-text-base)]/[0.07] last:border-0"
                >
                  <p className="text-sm text-[var(--color-text-base)] truncate">{oa.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] font-mono text-[var(--color-muted)]">{oa.sections?.length || 0} sections</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate((oa.participants || []).length > 0 ? `/oa/${oa._id}/results` : `/oa/${oa._id}`)}
                        className="text-[10px] uppercase font-mono px-2 py-1 rounded border border-[var(--color-text-base)]/[0.12] hover:border-[var(--color-accent)] text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                      >
                        {(oa.participants || []).length > 0 ? 'Results' : 'Start'}
                      </button>
                      <button
                        onClick={() => handleDeleteOA(oa._id)}
                        className="text-[10px] uppercase font-mono px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {soloOAs.length === 0 && <p className="text-xs text-[var(--color-muted)] font-mono">No solo assessments yet.</p>}
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-text-base)]/[0.07] rounded-[12px] p-4">
              <p className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-wide mb-3">Coding Rounds</p>
              {soloRounds.slice(0, 8).map((round) => (
                <div
                  key={round._id}
                  className="py-2 border-b border-[var(--color-text-base)]/[0.07] last:border-0"
                >
                  <p className="text-sm text-[var(--color-text-base)] truncate">{round.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] font-mono text-[var(--color-muted)]">{round.status}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(round.status === 'Completed' ? `/coding-round/${round._id}/results` : `/coding-round/${round._id}/lobby`)}
                        className="text-[10px] uppercase font-mono px-2 py-1 rounded border border-[var(--color-text-base)]/[0.12] hover:border-[var(--color-accent)] text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                      >
                        {round.status === 'Completed' ? 'Results' : 'Start'}
                      </button>
                      <button
                        onClick={() => handleDeleteRound(round._id)}
                        className="text-[10px] uppercase font-mono px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {soloRounds.length === 0 && <p className="text-xs text-[var(--color-muted)] font-mono">No solo coding rounds yet.</p>}
            </div>
          </div>

          <div className="w-full">
            <StreakCard />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PersonalDashboard;
