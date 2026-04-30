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
const { protect, checkNotDemo } = require("../middleware/auth");

router.post("/generate", protect, checkNotDemo, generateQuestions);
router.post("/", protect, checkNotDemo, createCodingRound);
router.get("/topics", protect, getProblemTopics);
router.get("/:id", protect, getCodingRound);
router.put("/:id/end", protect, checkNotDemo, endCodingRound);
router.delete("/:id", protect, checkNotDemo, deleteCodingRound);
router.post("/:id/join", protect, checkNotDemo, joinCodingRound);
router.post("/:id/submit", protect, checkNotDemo, submitSolution); // Piston submit

// External Round Routes
router.post("/:id/questions", protect, checkNotDemo, addQuestionToRound);
router.post("/:id/start", protect, checkNotDemo, startRound);
router.put(
  "/:id/questions/:questionId/start",
  protect,
  checkNotDemo,
  startQuestionTimer,
);
router.put(
  "/:id/questions/:questionId/pause",
  protect,
  checkNotDemo,
  pauseQuestionTimer,
);
router.post(
  "/:id/submit-external",
  protect,
  checkNotDemo,
  submitExternalQuestion,
);

module.exports = router;
