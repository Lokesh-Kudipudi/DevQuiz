import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Layout from "../components/ui/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import BasicDetailsForm from "../components/coding-round/BasicDetailsForm";

const CreateCodingRound = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const isSoloMode = !groupId;
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const roundType = "External";
  const [allowSelfAttempt, setAllowSelfAttempt] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        title,
        timeLimit,
        type: roundType,
        allowSelfAttempt,
      };

      const { data } = await axios.post(
        isSoloMode ? "/api/solo/coding-rounds" : "/api/coding-rounds",
        isSoloMode ? payload : { ...payload, groupId },
      );

      navigate(`/coding-round/${data._id}/lobby`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create coding round",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-6">
        <Card>
          <h1 className="text-3xl font-bold text-white mb-6">
            Create Coding Round
          </h1>
          <p className="text-gray-400 mb-6">
            {isSoloMode
              ? "Create a personal coding practice round."
              : "Create and host a coding round for your group."}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <BasicDetailsForm
              title={title}
              setTitle={setTitle}
              timeLimit={timeLimit}
              setTimeLimit={setTimeLimit}
              roundType={roundType}
              allowSelfAttempt={allowSelfAttempt}
              setAllowSelfAttempt={setAllowSelfAttempt}
            />

            <div className="flex justify-end pt-6 border-t border-gray-700 mt-8">
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? "Creating..." : "Create Lobby"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateCodingRound;
