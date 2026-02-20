import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Layout from "../components/ui/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

const CodingRoundLobby = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [round, setRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [difficultyFilter, setDifficultyFilter] =
    useState("Any");
  const [tagFilter, setTagFilter] = useState("");
  const [allTopics, setAllTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);

  const fetchRound = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `/api/coding-rounds/${id}`,
      );
      setRound(data);
      if (data.status === "Live") {
        navigate(`/coding-round/${id}/live`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load round details");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchRound();

    // Setup socket listener
    const newSocket = io(
      import.meta.env.VITE_API_URL || "http://localhost:5174",
    );

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      newSocket.emit("join_round", id);
    });

    newSocket.on("question_added", () => {
      fetchRound();
    });

    newSocket.on("round_started", () => {
      console.log("Round started!");
      navigate(`/coding-round/${id}/live`);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [fetchRound, id, navigate]);

  useEffect(() => {
    let isMounted = true;

    const loadTopics = async () => {
      try {
        setTopicsLoading(true);
        const { data } = await axios.get(
          "/api/coding-rounds/topics",
        );
        if (isMounted) {
          setAllTopics(
            Array.isArray(data?.topics) ? data.topics : [],
          );
        }
      } catch (err) {
        console.error("Failed to load topic suggestions", err);
      } finally {
        if (isMounted) {
          setTopicsLoading(false);
        }
      }
    };

    loadTopics();

    return () => {
      isMounted = false;
    };
  }, []);

  const parsedTags = useMemo(
    () =>
      tagFilter
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagFilter],
  );

  const activeTagFragment = useMemo(() => {
    const rawParts = tagFilter.split(",");
    return rawParts[rawParts.length - 1].trim();
  }, [tagFilter]);

  const tagSuggestions = useMemo(() => {
    if (!activeTagFragment) {
      return [];
    }

    const selectedTagSet = new Set(
      parsedTags.map((tag) => tag.toLowerCase()),
    );

    return allTopics
      .filter((topic) => {
        const topicLower = topic.toLowerCase();
        return (
          topicLower.includes(activeTagFragment.toLowerCase()) &&
          !selectedTagSet.has(topicLower)
        );
      })
      .slice(0, 8);
  }, [activeTagFragment, allTopics, parsedTags]);

  const applyTagSuggestion = (suggestion) => {
    const prefixTags = tagFilter
      .split(",")
      .slice(0, -1)
      .map((tag) => tag.trim())
      .filter(Boolean);

    const nextTags = [...prefixTags, suggestion].join(", ");
    setTagFilter(`${nextTags}, `);
  };

  const handleStartRound = async () => {
    try {
      await axios.post(`/api/coding-rounds/${id}/start`);
      navigate(`/coding-round/${id}/live`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to start round",
      );
    }
  };

  const handleAddQuestion = async () => {
    try {
      setAddingQuestion(true);
      setError("");
      await axios.post(`/api/coding-rounds/${id}/questions`, {
        difficulties:
          difficultyFilter === "Any" ? [] : [difficultyFilter],
        topics: tagFilter
          .split(",")
          .map((topic) => topic.trim())
          .filter(Boolean),
      });
      setIsAddModalOpen(false);
      await fetchRound();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add question",
      );
    } finally {
      setAddingQuestion(false);
    }
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

  const creatorId = (
    round.creator?._id || round.creator
  )?.toString();
  const currentUserId = user?._id?.toString();
  const isCreator =
    Boolean(creatorId) && creatorId === currentUserId;
  const canAddQuestions = round.status === "Pending";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Controls */}
        <Card>
          {error && (
            <div className="text-red-400 text-sm mb-4">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-white mb-2 wrap-break-word">
                {round.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-400 text-sm">
                <span>
                  Host:{" "}
                  {user?._id ===
                  (round.creator._id || round.creator)
                    ? "You"
                    : round.creator.name || "Admin"}
                </span>
                <span>•</span>
                <span>Time Limit: {round.timeLimit} mins</span>
                <span>•</span>
                <span className="text-yellow-400">
                  Status: Lobby (Waiting to start)
                </span>
              </div>
            </div>
            {isCreator && (
              <Button
                onClick={handleStartRound}
                className="self-start md:self-center bg-green-600 hover:bg-green-700 font-bold px-5 py-3 text-base whitespace-nowrap"
              >
                START ROUND 🚀
              </Button>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card className="h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Questions Pool
              </h2>
              <div className="flex items-center gap-3">
                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                  {round.questions.length} Questions
                </span>
                {canAddQuestions && (
                  <Button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 text-sm"
                  >
                    Add Random Question
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {round.questions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
                  <p>No questions added yet.</p>
                  <p className="text-sm mt-1">
                    Use Add Random Question to build the pool.
                  </p>
                </div>
              ) : (
                round.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      q.isSkeleton
                        ? "bg-gray-900/50 border-gray-800 opacity-75"
                        : "bg-gray-800 border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-400">
                        {idx + 1}
                      </div>
                      <div>
                        <h3
                          className={`font-bold ${q.title === "Hidden Question" ? "text-gray-500 italic" : "text-gray-200"}`}
                        >
                          {q.title}
                        </h3>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                          {q.platform !== "?" && (
                            <span className="bg-gray-900 px-2 py-0.5 rounded text-gray-300 border border-gray-700">
                              {q.platform}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-bold text-lg ${
                          q.points > 3
                            ? "text-yellow-400"
                            : "text-primary-400"
                        }`}
                      >
                        {q.points} pts
                      </div>
                      <div
                        className={`text-xs font-bold uppercase ${
                          q.difficulty === "Easy"
                            ? "text-green-500"
                            : q.difficulty === "Medium"
                              ? "text-yellow-500"
                              : q.difficulty === "Hard"
                                ? "text-red-500"
                                : "text-gray-600"
                        }`}
                      >
                        {q.difficulty}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Random Question"
        footer={
          <>
            <Button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddQuestion}
              disabled={addingQuestion}
            >
              {addingQuestion ? "Adding..." : "Add"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Difficulty
            </label>
            <select
              value={difficultyFilter}
              onChange={(e) =>
                setDifficultyFilter(e.target.value)
              }
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500"
            >
              <option value="Any">Any Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              placeholder="e.g., Array, Sliding Window"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />

            {topicsLoading && (
              <p className="text-xs text-gray-500">
                Loading tag suggestions...
              </p>
            )}

            {!topicsLoading && tagSuggestions.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  Suggestions
                </p>
                <div className="flex flex-wrap gap-2">
                  {tagSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() =>
                        applyTagSuggestion(suggestion)
                      }
                      className="px-2 py-1 text-xs rounded border border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default CodingRoundLobby;
