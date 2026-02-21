import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

/* ──────────────────────────────
   Helpers
────────────────────────────── */
const formatTime = (secs) => {
    if (secs <= 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// Renders question text — plain text or markdown with syntax-highlighted code blocks
const QuestionText = ({ text }) => {
    const hasCode = text.includes('```');
    if (!hasCode) return <p className="text-gray-100 font-medium leading-relaxed">{text}</p>;
    return (
        <div className="text-gray-100 font-medium leading-relaxed prose prose-invert prose-sm max-w-none"
            style={{
                '--tw-prose-pre-bg': '#0d1117',
                '--tw-prose-pre-border': '1px solid #30363d',
            }}
        >
            <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                    code({ className, children, ...props }) {
                        return <code className={`${className ?? ''} text-sm`} {...props}>{children}</code>;
                    },
                    pre({ children }) {
                        return (
                            <pre className="rounded-xl overflow-x-auto my-3 p-4 bg-[#0d1117] border border-gray-700/50 text-sm">
                                {children}
                            </pre>
                        );
                    }
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    );
};

/* ──────────────────────────────
   Component
────────────────────────────── */
const TakeOA = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // UI states: 'loading' | 'dashboard' | 'confirm-start' | 'section' | 'between-sections' | 'ended'
    const [view, setView] = useState('loading');
    const [oa, setOa] = useState(null);
    const [participant, setParticipant] = useState(null);

    // Section player state
    const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
    const [answers, setAnswers] = useState([]); // answers for the current active section
    const [timeLeft, setTimeLeft] = useState(0);

    // Sync answersRef whenever answers state changes
    useEffect(() => { answersRef.current = answers; }, [answers]);
    const [submitting, setSubmitting] = useState(false);

    // Modals
    const [showEndConfirm, setShowEndConfirm] = useState(false);
    const [showSubmitSectionConfirm, setShowSubmitSectionConfirm] = useState(false);
    const [offlineCountdown, setOfflineCountdown] = useState(null); // number or null

    // Refs
    const timerRef = useRef(null);
    const offlineTimerRef = useRef(null);
    const assessmentEndedRef = useRef(false); // prevent double-termination
    const hasStartedRef = useRef(false);
    // Keep a ref that always mirrors `answers` so stale-closure callbacks (timer) can read the latest value
    const answersRef = useRef([]);

    /* ──────────────────────────────
       Termination (fire-and-forget)
    ────────────────────────────── */
    const terminateAssessment = useCallback(async (redirect = true) => {
        if (assessmentEndedRef.current) return;
        assessmentEndedRef.current = true;

        clearInterval(timerRef.current);
        clearInterval(offlineTimerRef.current);

        // Use sendBeacon for reliability on unload
        const url = `${import.meta.env.VITE_API_URL || ''}/api/online-assessments/${id}/end`;
        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify({})], { type: 'application/json' });
            navigator.sendBeacon(url, blob);
        } else {
            try { await axios.put(`/api/online-assessments/${id}/end`); } catch (_) {}
        }

        if (redirect) navigate(`/oa/${id}/results`, { replace: true });
    }, [id, navigate]);

    /* ──────────────────────────────
       Fetch OA data
    ────────────────────────────── */
    useEffect(() => {
        const fetchOA = async () => {
            try {
                const { data } = await axios.get(`/api/online-assessments/${id}`);
                setOa(data);
                setParticipant(data.participant);

                if (data.participant) {
                    const p = data.participant;
                    if (p.status === 'completed' || p.status === 'terminated') {
                        // Already done — go to results
                        navigate(`/oa/${id}/results`, { replace: true });
                        return;
                    }
                    // Resume: find first non-submitted section
                    const nextIdx = data.sections.findIndex(
                        (_, sIdx) => !p.sectionSubmissions.some(ss => ss.sectionIndex === sIdx)
                    );
                    if (nextIdx === -1) {
                        navigate(`/oa/${id}/results`, { replace: true });
                        return;
                    }
                    // Already started → jump into section player
                    hasStartedRef.current = true;
                    setCurrentSectionIdx(nextIdx);
                    setAnswers(new Array(data.sections[nextIdx].questions.length).fill(null));
                    setTimeLeft(data.sections[nextIdx].timeLimit * 60);
                    setView('section');
                } else {
                    setView('dashboard');
                }
            } catch (err) {
                toast.error('Failed to load assessment');
                navigate(-1);
            }
        };
        fetchOA();
    }, [id, navigate]);

    /* ──────────────────────────────
       Section timer
    ────────────────────────────── */
    // Ref initialized as null — populated by useEffect after handleSubmitSection is declared below
    const handleSubmitSectionRef = useRef(null);

    useEffect(() => {
        if (view !== 'section') return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    // Auto-submit via ref so we always call the latest closure, never a stale one
                    handleSubmitSectionRef.current(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [view, currentSectionIdx]);

    /* ──────────────────────────────
       Back-navigation / route change prevention
    ────────────────────────────── */
    useEffect(() => {
        if (view !== 'section' && view !== 'between-sections') return;

        const handlePopState = () => {
            terminateAssessment(true);
        };

        // Push a state so that back-press can be caught
        window.history.pushState(null, '', window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [view, terminateAssessment]);

    /* ──────────────────────────────
       Before-unload (tab close / refresh)
    ────────────────────────────── */
    useEffect(() => {
        if (!hasStartedRef.current) return;

        const handleBeforeUnload = (e) => {
            terminateAssessment(false); // fire-and-forget, no redirect possible
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [terminateAssessment]);

    /* ──────────────────────────────
       Offline detection
    ────────────────────────────── */
    useEffect(() => {
        if (view !== 'section' && view !== 'between-sections') return;

        const handleOffline = () => {
            let countdown = 10;
            setOfflineCountdown(countdown);
            offlineTimerRef.current = setInterval(() => {
                countdown -= 1;
                setOfflineCountdown(countdown);
                if (countdown <= 0) {
                    clearInterval(offlineTimerRef.current);
                    terminateAssessment(true);
                }
            }, 1000);
        };

        const handleOnline = () => {
            clearInterval(offlineTimerRef.current);
            setOfflineCountdown(null);
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);
        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, [view, terminateAssessment]);

    /* ──────────────────────────────
       Actions
    ────────────────────────────── */
    const handleStartAssessment = async () => {
        try {
            const { data } = await axios.post(`/api/online-assessments/${id}/start`);
            setParticipant(data.participant);
            hasStartedRef.current = true;
            const sectionIdx = 0;
            setCurrentSectionIdx(sectionIdx);
            setAnswers(new Array(oa.sections[sectionIdx].questions.length).fill(null));
            setTimeLeft(oa.sections[sectionIdx].timeLimit * 60);
            setView('section');
        } catch (err) {
            toast.error('Failed to start assessment');
        }
    };

    const handleSubmitSection = useCallback(async (autoSubmit = false) => {
        if (assessmentEndedRef.current) return;
        setSubmitting(prev => {
            if (prev) return prev; // already submitting
            return true;
        });
        clearInterval(timerRef.current);

        // Read answers from ref so this works correctly even from a stale-closure context (e.g. timer callback)
        const currentAnswers = answersRef.current;

        try {
            const currentSection = oa?.sections[currentSectionIdx];
            if (!currentSection) return;
            // timeLeft may be 0 on auto-submit; compute from ref'd answers length to avoid stale value
            const timeTaken = currentSection.timeLimit * 60 - (autoSubmit ? 0 : timeLeft);
            const { data } = await axios.post(`/api/online-assessments/${id}/submit-section`, {
                sectionIndex: currentSectionIdx,
                answers: currentAnswers,
                timeTaken
            });

            if (data.status === 'completed') {
                assessmentEndedRef.current = true;
                toast.success('Assessment complete!');
                navigate(`/oa/${id}/results`, { replace: true });
            } else {
                // More sections remain
                setSubmitting(false);
                setView('between-sections');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit section');
            setSubmitting(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, oa, currentSectionIdx, timeLeft, navigate]);

    // Keep the ref in sync so the timer interval always calls the latest version
    useEffect(() => { handleSubmitSectionRef.current = handleSubmitSection; }, [handleSubmitSection]);

    const startNextSection = () => {
        const nextIdx = currentSectionIdx + 1;
        if (nextIdx >= oa.sections.length) {
            navigate(`/oa/${id}/results`, { replace: true });
            return;
        }
        setCurrentSectionIdx(nextIdx);
        setAnswers(new Array(oa.sections[nextIdx].questions.length).fill(null));
        setTimeLeft(oa.sections[nextIdx].timeLimit * 60);
        setSubmitting(false);
        setView('section');
    };

    const handleEndAssessment = async () => {
        setShowEndConfirm(false);
        await terminateAssessment(true);
    };

    /* ──────────────────────────────
       Renders
    ────────────────────────────── */
    if (view === 'loading') {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                </div>
            </Layout>
        );
    }

    // ── Pre-start Dashboard ──
    if (view === 'dashboard') {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-violet-500/30">
                            <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-1">{oa.title}</h1>
                        <p className="text-gray-400">{oa.sections.length} sections · {oa.sections.reduce((s, sec) => s + sec.questionCount, 0)} total questions</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        {oa.sections.map((section, idx) => (
                            <Card key={idx} className="border-violet-500/20">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-violet-900/50 border border-violet-500/40 flex items-center justify-center text-violet-300 font-bold flex-shrink-0 mt-1">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-1">{section.name}</h3>
                                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{section.topics}</p>
                                        <div className="flex gap-4 text-sm">
                                            <span className="flex items-center gap-1.5 text-gray-300">
                                                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                {section.questionCount} Questions
                                            </span>
                                            <span className="flex items-center gap-1.5 text-gray-300">
                                                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {section.timeLimit} Minutes
                                            </span>
                                            <span className="flex items-center gap-1.5 text-gray-300">
                                                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                1 Mark each
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card className="bg-amber-500/10 border-amber-500/30 mb-6">
                        <div className="flex gap-3">
                            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="text-sm text-amber-300 space-y-1">
                                <p className="font-semibold">Important Instructions</p>
                                <ul className="list-disc list-inside text-amber-200/80 space-y-0.5">
                                    <li>Once you start a section, you cannot leave until it is submitted or time runs out.</li>
                                    <li>Navigating away (back button, URL change) will <strong>terminate</strong> your assessment.</li>
                                    <li>Losing internet for 10+ seconds will terminate your assessment.</li>
                                    <li>Submitted sections are final — you cannot re-attempt them.</li>
                                    <li>You may switch browser tabs freely.</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-between">
                        <Button variant="ghost" onClick={() => navigate(-1)}>Go Back</Button>
                        <Button
                            className="bg-violet-600 hover:bg-violet-700 border-violet-600 px-8"
                            onClick={() => setView('confirm-start')}
                        >
                            Start Assessment →
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    // ── Confirm Start Modal (shown over dashboard) ──
    if (view === 'confirm-start') {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Card className="max-w-md w-full text-center border-violet-500/30">
                        <div className="w-14 h-14 rounded-full bg-violet-900/30 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Ready to Begin?</h2>
                        <p className="text-gray-400 mb-6">
                            Once you confirm, your assessment begins. <span className="text-red-400 font-medium">Going back will terminate it permanently.</span>
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button variant="ghost" onClick={() => setView('dashboard')}>Back to Details</Button>
                            <Button
                                className="bg-violet-600 hover:bg-violet-700 border-violet-600"
                                onClick={handleStartAssessment}
                            >
                                Yes, Start Now
                            </Button>
                        </div>
                    </Card>
                </div>
            </Layout>
        );
    }

    // ── Section Player ──
    if (view === 'section') {
        const section = oa?.sections[currentSectionIdx];
        if (!section) return null;

        const answered = answers.filter(a => a !== null).length;
        const timerColor = timeLeft < 60
            ? 'text-red-400 animate-pulse'
            : timeLeft < 5 * 60
                ? 'text-amber-400'
                : 'text-green-400';

        return (
            <div className="min-h-screen bg-gray-950 text-white">
                {/* Offline warning banner */}
                {offlineCountdown !== null && (
                    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-3 text-sm font-semibold">
                        ⚠️ Internet connection lost. Assessment will terminate in {offlineCountdown}s unless you reconnect.
                    </div>
                )}

                {/* Header bar */}
                <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                Section {currentSectionIdx + 1} of {oa.sections.length}
                            </p>
                            <h2 className="text-lg font-bold text-white">{section.name}</h2>
                        </div>

                        <div className={`text-3xl font-mono font-bold ${timerColor}`}>
                            {formatTime(timeLeft)}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400">{answered}/{section.questions.length} answered</span>
                            <Button
                                size="sm"
                                className="bg-red-600/80 hover:bg-red-700 border-red-600 text-sm"
                                onClick={() => setShowEndConfirm(true)}
                            >
                                End Assessment
                            </Button>
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="max-w-4xl mx-auto mt-2">
                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-1 bg-violet-500 rounded-full transition-all duration-1000"
                                style={{ width: `${(timeLeft / (section.timeLimit * 60)) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-6 space-y-6">
                    {section.questions.map((q, qIdx) => (
                        <Card key={qIdx} className={`transition-all ${answers[qIdx] ? 'border-violet-500/30' : 'border-gray-700/50'}`}>
                            <div className="flex gap-3 mb-4">
                                <span className="w-8 h-8 rounded-lg bg-violet-900/40 border border-violet-500/30 flex items-center justify-center text-sm font-bold text-violet-300 flex-shrink-0 mt-0.5">
                                    {qIdx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <QuestionText text={q.question} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2 pl-11">
                                {q.options.map((opt, oIdx) => (
                                    <label
                                        key={oIdx}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
                                            answers[qIdx] === opt
                                                ? 'border-violet-500 bg-violet-500/15 text-white'
                                                : 'border-gray-700/50 bg-gray-800/30 text-gray-300 hover:border-gray-600 hover:bg-gray-800/60'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`q-${qIdx}`}
                                            value={opt}
                                            checked={answers[qIdx] === opt}
                                            onChange={() => {
                                                const updated = [...answers];
                                                updated[qIdx] = opt;
                                                setAnswers(updated);
                                            }}
                                            className="sr-only"
                                        />
                                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                            answers[qIdx] === opt ? 'border-violet-400' : 'border-gray-600'
                                        }`}>
                                            {answers[qIdx] === opt && <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />}
                                        </span>
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </Card>
                    ))}

                    <div className="flex justify-end pt-4 pb-10">
                        <Button
                            className="bg-violet-600 hover:bg-violet-700 border-violet-600 px-10"
                            onClick={() => setShowSubmitSectionConfirm(true)}
                            loading={submitting}
                        >
                            Submit Section {currentSectionIdx + 1}
                        </Button>
                    </div>
                </div>

                {/* Submit Section Confirm Modal */}
                {showSubmitSectionConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <Card className="max-w-md w-full mx-4 border-violet-500/30 text-center">
                            <h3 className="text-xl font-bold text-white mb-2">Submit Section {currentSectionIdx + 1}?</h3>
                            <p className="text-gray-400 mb-2">
                                You have answered <span className="text-white font-semibold">{answered}</span> out of{' '}
                                <span className="text-white font-semibold">{section.questions.length}</span> questions.
                            </p>
                            {answered < section.questions.length && (
                                <p className="text-amber-400 text-sm mb-4">
                                    ⚠️ {section.questions.length - answered} questions are unanswered.
                                </p>
                            )}
                            <p className="text-gray-500 text-sm mb-6">Once submitted, this section cannot be re-attempted.</p>
                            <div className="flex gap-3 justify-center">
                                <Button variant="ghost" onClick={() => setShowSubmitSectionConfirm(false)}>Cancel</Button>
                                <Button
                                    className="bg-violet-600 hover:bg-violet-700 border-violet-600"
                                    onClick={() => { setShowSubmitSectionConfirm(false); handleSubmitSection(); }}
                                    loading={submitting}
                                >
                                    Submit
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* End Assessment Confirm Modal */}
                {showEndConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <Card className="max-w-md w-full mx-4 border-red-500/30 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">End Assessment?</h3>
                            <p className="text-gray-400 mb-6">
                                Your progress will be saved for submitted sections, but the current section will be <span className="text-red-400 font-semibold">terminated</span> without submission.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button variant="ghost" onClick={() => setShowEndConfirm(false)}>Cancel</Button>
                                <Button className="bg-red-600 hover:bg-red-700 border-red-600" onClick={handleEndAssessment}>
                                    End Assessment
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        );
    }

    // ── Between Sections ──
    if (view === 'between-sections') {
        const nextIdx = currentSectionIdx + 1;
        const nextSection = oa?.sections[nextIdx];

        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
                <Card className="max-w-md w-full text-center border-green-500/30">
                    <div className="w-14 h-14 rounded-full bg-green-900/30 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Section {currentSectionIdx + 1} Submitted!
                    </h2>
                    {nextSection ? (
                        <>
                            <p className="text-gray-400 mb-6">
                                Next up: <span className="text-white font-semibold">{nextSection.name}</span>{' '}
                                ({nextSection.questionCount} questions · {nextSection.timeLimit} min)
                            </p>
                            <p className="text-amber-400 text-sm mb-6">
                                Once you start the next section, you cannot navigate away.
                            </p>
                            <Button
                                className="bg-violet-600 hover:bg-violet-700 border-violet-600 w-full"
                                onClick={startNextSection}
                            >
                                Start Section {nextIdx + 1} →
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-400 mb-6">All sections completed!</p>
                            <Button
                                className="bg-violet-600 hover:bg-violet-700 border-violet-600 w-full"
                                onClick={() => navigate(`/oa/${id}/results`, { replace: true })}
                            >
                                View Results
                            </Button>
                        </>
                    )}
                </Card>
            </div>
        );
    }

    return null;
};

export default TakeOA;
