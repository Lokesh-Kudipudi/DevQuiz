const express = require("express");
const router = express.Router();
const {
  createCodingRound,
  getProblemTopics,
  getCodingRound,
  joinCodingRound,
  submitSolution,
  generateQuestions,
  deleteCodingRound,
  addQuestionToRound,
  startRound,
  startQuestionTimer,
  pauseQuestionTimer,
  submitExternalQuestion,
  endCodingRound,
} = require("../controllers/codingRoundController");
const { protect } = require("../middleware/auth");

router.post("/generate", protect, generateQuestions);
router.post("/", protect, createCodingRound);
router.get("/topics", protect, getProblemTopics);
router.get("/:id", protect, getCodingRound);
router.put("/:id/end", protect, endCodingRound);
router.delete("/:id", protect, deleteCodingRound);
router.post("/:id/join", protect, joinCodingRound);
router.post("/:id/submit", protect, submitSolution); // Piston submit

// External Round Routes
router.post("/:id/questions", protect, addQuestionToRound);
router.post("/:id/start", protect, startRound);
router.put(
  "/:id/questions/:questionId/start",
  protect,
  startQuestionTimer,
);
router.put(
  "/:id/questions/:questionId/pause",
  protect,
  pauseQuestionTimer,
);
router.post(
  "/:id/submit-external",
  protect,
  submitExternalQuestion,
);

module.exports = router;
