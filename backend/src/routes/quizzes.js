const express = require("express");
const router = express.Router();
const { protect, checkNotDemo } = require("../middleware/auth");
const {
  createQuiz,
  getSoloQuizzes,
  getQuiz,
  attemptQuiz,
  getQuizResults,
  deleteQuiz,
} = require("../controllers/quizController");

router.post("/generate", protect, checkNotDemo, createQuiz);
router.get("/solo", protect, getSoloQuizzes);
router.get("/:id", protect, getQuiz);
router.post("/:id/attempt", protect, checkNotDemo, attemptQuiz);
router.get("/:id/results", protect, getQuizResults);
router.delete("/:id", protect, checkNotDemo, deleteQuiz);

module.exports = router;
