import { useAuth } from '../../context/AuthContext';
import QuestionDisplay from '../ui/QuestionDisplay';
import { Link } from 'react-router-dom';
import {
  PERF_CARD_STYLES,
  PERF_STAT_BOX_STYLES,
  PERF_STAT_LABEL_STYLES,
  PERF_STAT_VALUE,
  QUESTION_CARD_STYLES,
  QUESTION_CARD_CORRECT,
  QUESTION_CARD_WRONG,
  QUESTION_CARD_PENDING,
  QUESTION_NUMBER_BADGE,
  OPTION_STYLES,
} from '../../constants/ui';
import Button from '../ui/Button';

const MyResultsView = ({ quiz, attempt, myRank, quizId }) => {
    const { user } = useAuth();

    if (!attempt) {
        return (
            <div className="py-12 px-6 text-center bg-[#111118] border border-dashed border-white/[0.07] rounded-[12px]">
                <div className="text-3xl mb-3 opacity-40">📝</div>
                <p className="font-['Syne',sans-serif] font-semibold text-[#f0f0f5] text-sm mb-2">You haven't taken this quiz yet</p>
                <p className="text-xs text-[#6b6b80] font-mono mb-5">Test your knowledge and see where you rank!</p>
                <Link to={`/quiz/${quizId}`}>
                    <Button variant="primary">Start Quiz Now</Button>
                </Link>
            </div>
        );
    }

    const percentage = Math.round((attempt.score / quiz.questions.length) * 100);
    const userAnswers = attempt.answers || [];

    return (
        <div>
            {/* Performance card */}
            <div className={PERF_CARD_STYLES}>
                {/* Left */}
                <div>
                    <h2 className="font-['Syne',sans-serif] font-bold text-lg text-[#f0f0f5] mb-1">
                        Your Performance
                    </h2>
                    <p className="text-[11px] text-[#6b6b80] font-mono mb-3">
                        Here's how you did on this quiz
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 bg-[#1a1a24] border border-white/[0.07] rounded-full text-[#6b6b80] font-mono">
                        🗓 Attempted on {new Date(attempt.attemptedAt || Date.now()).toLocaleDateString()}
                    </span>
                </div>

                {/* Right: stat boxes */}
                <div className="flex gap-4">
                    <div className={PERF_STAT_BOX_STYLES}>
                        <div className={PERF_STAT_LABEL_STYLES}>Score</div>
                        <div className={PERF_STAT_VALUE.score}>{attempt.score}/{quiz.questions.length}</div>
                    </div>
                    <div className={PERF_STAT_BOX_STYLES}>
                        <div className={PERF_STAT_LABEL_STYLES}>Rank</div>
                        <div className={PERF_STAT_VALUE.rank}>#{myRank}</div>
                    </div>
                    <div className={PERF_STAT_BOX_STYLES}>
                        <div className={PERF_STAT_LABEL_STYLES}>Accuracy</div>
                        <div className={PERF_STAT_VALUE.accuracy}>{percentage}%</div>
                    </div>
                </div>
            </div>

            {/* Question review */}
            <h3 className="font-['Syne',sans-serif] font-bold text-base text-[#f0f0f5] flex items-center gap-2 mb-4 mt-8">
                <svg className="w-4 h-4 text-[#7fff6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Detailed Review
            </h3>

            <div>
                {quiz.questions.map((q, qIdx) => {
                    const userAnsObj = userAnswers.find(a => a.questionIndex === qIdx);
                    const userSelected = userAnsObj?.selectedOption;
                    const isCorrect = userAnsObj?.isCorrect;

                    const cardBorderClass = isCorrect ? QUESTION_CARD_CORRECT : (userAnsObj ? QUESTION_CARD_WRONG : QUESTION_CARD_PENDING);
                    const badgeClass = isCorrect
                        ? QUESTION_NUMBER_BADGE.correct
                        : (userAnsObj ? QUESTION_NUMBER_BADGE.wrong : QUESTION_NUMBER_BADGE.default);

                    return (
                        <div key={qIdx} className={`${QUESTION_CARD_STYLES} ${cardBorderClass}`}>
                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className={badgeClass}>{qIdx + 1}</div>
                                <div className="text-[13px] text-[#f0f0f5] leading-relaxed font-mono flex-1">
                                    <QuestionDisplay content={q.question} />
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex flex-col gap-2 mt-4 ml-10">
                                {q.options.map((opt, optIdx) => {
                                    let style = OPTION_STYLES.default;
                                    let badge = null;

                                    if (opt === q.correctAnswer) {
                                        style = OPTION_STYLES.correct;
                                        badge = <span className="text-[10px] text-[#7fff6e] font-mono ml-2 shrink-0">✓ Correct</span>;
                                    } else if (opt === userSelected && !isCorrect) {
                                        style = OPTION_STYLES.wrong;
                                        badge = <span className="text-[10px] text-[#ff5555] font-mono ml-2 shrink-0">✗ Your answer</span>;
                                    }

                                    return (
                                        <div key={optIdx} className={style}>
                                            <span>{opt}</span>
                                            {badge}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyResultsView;
