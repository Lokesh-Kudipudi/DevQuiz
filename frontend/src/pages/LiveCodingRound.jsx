import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Layout from "../components/ui/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LiveLeaderboard from "../components/quiz/LiveLeaderboard";
import { useAuth } from "../context/AuthContext";

import Modal from "../components/ui/Modal";

// Timer Component for individual questions
const QuestionTimer = ({
  startTime,
  accumulatedTime,
  status,
}) => {
  // ... (existing timer code) ...
  const [time, setTime] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      if (status !== "Solving") {
        setTime(accumulatedTime || 0);
        return;
      }

      const now = new Date().getTime();
      // Ensure startTime is treated as a valid date
      const start = startTime
        ? new Date(startTime).getTime()
        : now;
      const elapsed = Math.floor((now - start) / 1000);
      const total = (accumulatedTime || 0) + elapsed;

      // Prevent negative time due to clock skew
      setTime(Math.max(0, total));
    };

    updateTime(); // Initial update

    if (status === "Solving" && startTime) {
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, accumulatedTime, status]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <span className="font-mono font-semibold text-base text-primary-400">
      {formatTime(time)}
    </span>
  );
};

const LiveCodingRound = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [round, setRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [error, setError] = useState("");

  // Modal States
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitQuestionId, setSubmitQuestionId] = useState(null);
  const [endRoundModalOpen, setEndRoundModalOpen] =
    useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await axios.post(`/api/coding-rounds/${id}/join`);
      } catch (err) {
        console.error("Error joining round:", err);
      }
      fetchRound();
    };
    init();

    const interval = setInterval(fetchRound, 10000); // Polling for updates as backup to socket
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (!round) return;

    // Calculate time left
    const updateTimer = () => {
      if (!round.endTime) return;
      const end = new Date(round.endTime).getTime();
      const now = new Date().getTime();
      const remaining = Math.max(
        0,
        Math.floor((end - now) / 1000),
      );
      setTimeLeft(remaining);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [round]);

  const fetchRound = async () => {
    try {
      // Add timestamp to prevent caching (fix for 304 issue)
      const { data } = await axios.get(
        `/api/coding-rounds/${id}?t=${new Date().getTime()}`,
      );

      if (data.status === "Completed") {
        navigate(`/coding-round/${id}/results`);
        return;
      }

      // Only update if we have meaningful changes or it's the first load
      // For now, just setting it is fine, but the cache bust is critical
      setRound(data);
      setParticipant(data.participant);
      console.log(
        "Fetched participant status:",
        data.participant?.questionStatus,
      );

      if (data.status === "Pending") {
        navigate(`/coding-round/${id}/lobby`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load round");
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuestion = async (questionId, url) => {
    try {
      const { data } = await axios.put(
        `/api/coding-rounds/${id}/questions/${questionId}/start`,
      );
      // Open in new tab
      window.open(url, "_blank");

      // Optimistic update
      setParticipant((prev) => {
        if (!prev) return prev;
        const newStatus = prev.questionStatus
          ? [...prev.questionStatus]
          : [];
        const index = newStatus.findIndex(
          (qs) => qs.questionId === questionId,
        );
        if (index >= 0) {
          newStatus[index] = data;
        } else {
          newStatus.push(data);
        }
        return { ...prev, questionStatus: newStatus };
      });

      fetchRound();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to start question",
      );
    }
  };

  const handlePauseQuestion = async (questionId) => {
    try {
      const { data } = await axios.put(
        `/api/coding-rounds/${id}/questions/${questionId}/pause`,
      );

      // Optimistic update
      setParticipant((prev) => {
        if (!prev) return prev;
        const newStatus = prev.questionStatus.map((qs) =>
          qs.questionId === questionId ? data : qs,
        );
        return { ...prev, questionStatus: newStatus };
      });

      fetchRound();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to pause question",
      );
    }
  };

  const handleSubmitClick = (questionId) => {
    setSubmitQuestionId(questionId);
    setSubmitModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!submitQuestionId) return;

    try {
      await axios.post(
        `/api/coding-rounds/${id}/submit-external`,
        { questionId: submitQuestionId },
      );
      fetchRound();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit",
      );
    } finally {
      setSubmitModalOpen(false);
      setSubmitQuestionId(null);
    }
  };

  const handleEndRoundClick = () => {
    setEndRoundModalOpen(true);
  };

  const handleConfirmEndRound = async () => {
    try {
      await axios.put(`/api/coding-rounds/${id}/end`);
      // Socket will handle redirect, but we can also force it
      navigate(`/coding-round/${id}/results`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to end round",
      );
    } finally {
      setEndRoundModalOpen(false);
    }
  };

  const isCreator =
    round &&
    user &&
    (round.creator._id || round.creator) === user._id;

  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getQuestionData = (qId) => {
    if (!participant || !participant.questionStatus)
      return { status: "Pending" };
    return (
      participant.questionStatus.find(
        (qs) => qs.questionId === qId,
      ) || { status: "Pending" }
    );
  };

  if (loading)
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );

  if (!round) return <Layout>Round not found</Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-white mb-2 wrap-break-word">
                {round.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-400 text-sm">
                <span
                  className={
                    timeLeft < 300
                      ? "text-red-500 font-bold animate-pulse"
                      : "text-gray-300"
                  }
                >
                  Time Left: {formatTime(timeLeft)}
                </span>
                <span>•</span>
                <span>Score: {participant?.score || 0}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start md:self-center">
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  navigate(
                    `/groups/${round.group._id || round.group}`,
                  )
                }
              >
                Exit Round
              </Button>
              {isCreator && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleEndRoundClick()}
                >
                  End Round
                </Button>
              )}
            </div>
          </div>
        </Card>

        {error && (
          <div className="bg-red-900/50 text-red-200 p-4 rounded-lg border border-red-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">
              Your Challenges
            </h2>
            {round.questions.map((q, idx) => {
              const qData = getQuestionData(q._id);
              const status = qData.status;
              return (
                <Card
                  key={idx}
                  className={`transition-all ${
                    status === "Passed"
                      ? "border-green-600/50 bg-green-900/10"
                      : status === "Solving"
                        ? "border-yellow-600/50 bg-yellow-900/10"
                        : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gray-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <h3 className="text-base font-bold text-white">
                          {q.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            q.difficulty === "Easy"
                              ? "bg-green-900 text-green-300"
                              : q.difficulty === "Medium"
                                ? "bg-yellow-900 text-yellow-300"
                                : "bg-red-900 text-red-300"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-4 flex gap-4">
                        <span>{q.platform}</span>
                        <span>{q.points} Points</span>
                        {/* Timer Display */}
                        {(status === "Solving" ||
                          status === "Passed") && (
                          <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-gray-800 rounded-lg">
                            <span className="text-gray-400 text-xs uppercase">
                              Time:
                            </span>
                            <QuestionTimer
                              startTime={qData.lastStartTime}
                              accumulatedTime={
                                qData.accumulatedTime ||
                                qData.timeTaken
                              }
                              status={status}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {status === "Pending" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStartQuestion(q._id, q.url)
                          }
                        >
                          Start Solving
                        </Button>
                      )}
                      {status === "Solving" && (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            {qData.lastStartTime ? (
                              <Button
                                variant="danger"
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  handlePauseQuestion(q._id)
                                }
                              >
                                Pause
                              </Button>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="flex-1 bg-yellow-600/20 text-yellow-500 border-yellow-600/50 hover:bg-yellow-600/30"
                                onClick={() =>
                                  handleStartQuestion(
                                    q._id,
                                    q.url,
                                  )
                                }
                              >
                                Resume
                              </Button>
                            )}
                            <Button
                              variant="secondary"
                              size="sm"
                              className="flex-1"
                              onClick={() =>
                                window.open(q.url, "_blank")
                              }
                            >
                              Open Link
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 w-full"
                            onClick={() =>
                              handleSubmitClick(q._id)
                            }
                          >
                            Mark Done
                          </Button>
                        </div>
                      )}
                      {status === "Passed" && (
                        <div className="text-green-400 font-bold flex items-center gap-1">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <LiveLeaderboard
              roundId={id}
              currentUserId={user?._id}
              questions={round.questions}
              initialParticipants={round.participants || []}
            />
          </div>
        </div>
      </div>

      {/* Submit Question Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit Question"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setSubmitModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleConfirmSubmit}
            >
              Confirm Submit
            </Button>
          </>
        }
      >
        <p>
          Are you sure you have completed this question on the
          external platform?
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Make sure all test cases passed on the external site
          before submitting here.
        </p>
      </Modal>

      {/* End Round Modal */}
      <Modal
        isOpen={endRoundModalOpen}
        onClose={() => setEndRoundModalOpen(false)}
        title="End Round"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setEndRoundModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmEndRound}
            >
              End Round
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to end this round for everyone?
        </p>
        <p className="text-sm text-red-400 mt-2">
          This action cannot be undone. All participants will be
          redirected to the results page immediately.
        </p>
      </Modal>
    </Layout>
  );
};

export default LiveCodingRound;
