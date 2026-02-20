import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import QuestionDisplay from '../ui/QuestionDisplay';

const MyResultsView = ({ quiz, attempt, myRank, quizId }) => {
    if (!attempt) {
        return (
            <Card className="text-center py-12 border-dashed border-gray-700">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a16.084 16.084 0 00-5.466 5.927m-4.08 4.088a2 3 0 015.344 1.832" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">You haven't taken this quiz yet</h3>
                <p className="text-gray-400 mb-6">Test your knowledge and see where you rank!</p>
                <Link to={`/quiz/${quizId}`}>
                    <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/20">
                        Start Quiz Now
                    </button>
                </Link>
            </Card>
        );
    }

    const percentage = Math.round((attempt.score / quiz.questions.length) * 100);
    const userAnswers = attempt.answers || [];

    return (
        <div className="space-y-6">
            <Card className="border-primary-500/30 bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">Your Performance</h2>
                        <p className="text-gray-400">Here's how you did on this quiz</p>
                        <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                                Attempted on {new Date(attempt.attemptedAt || Date.now()).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 min-w-[100px] text-center">
                            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Score</div>
                            <div className="text-2xl font-bold text-primary-400">{attempt.score}/{quiz.questions.length}</div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 min-w-[100px] text-center">
                            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Rank</div>
                            <div className="text-2xl font-bold text-yellow-400">#{myRank}</div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 min-w-[100px] text-center">
                            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Accuracy</div>
                            <div className={`text-2xl font-bold ${percentage >= 70 ? 'text-green-400' : percentage >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {percentage}%
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <h3 className="text-xl font-bold text-white flex items-center pt-4">
                <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Detailed Review
            </h3>

            <div className="space-y-4">
                {quiz.questions.map((q, qIdx) => {
                    const userAnsObj = userAnswers.find(a => a.questionIndex === qIdx);
                    const userSelected = userAnsObj?.selectedOption;
                    const isCorrect = userAnsObj?.isCorrect;

                    return (
                        <Card key={qIdx} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                            <div className="flex items-start mb-4">
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold text-sm ${isCorrect ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                    {qIdx + 1}
                                </span>
                                <h4 className="text-lg font-medium text-white pt-1">
                                    <QuestionDisplay content={q.question} />
                                </h4>
                            </div>
                            <div className="space-y-2 ml-11">
                                {q.options.map((opt, optIdx) => {
                                    let optionClass = "p-3 rounded-lg border border-gray-700/50 bg-gray-800/50";
                                    let icon = null;
                                    
                                    // Highlight logic
                                    if (opt === q.correctAnswer) {
                                        optionClass = "p-3 rounded-lg border border-green-500/50 bg-green-500/10 text-green-200"; // Correct Answer
                                        icon = <span className="text-green-400 text-sm font-bold ml-2">✓ Correct Answer</span>;
                                    } else if (opt === userSelected && !isCorrect) {
                                        optionClass = "p-3 rounded-lg border border-red-500/50 bg-red-500/10 text-red-200"; // Wrong Selection
                                        icon = <span className="text-red-400 text-sm font-bold ml-2">✗ Your Answer</span>;
                                    }

                                    return (
                                        <div key={optIdx} className={optionClass}>
                                            <div className="flex justify-between items-center">
                                                <span>{opt}</span>
                                                {icon}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default MyResultsView;
