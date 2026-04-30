const express = require("express");
const router = express.Router();
const { protect, checkNotDemo } = require("../middleware/auth");
const {
  createOA,
  getOA,
  startOA,
  submitSection,
  endOA,
  getOAResults,
  deleteOA,
} = require("../controllers/onlineAssessmentController");

router.post("/generate-and-create", protect, checkNotDemo, createOA);
router.get("/:id", protect, getOA);
router.post("/:id/start", protect, checkNotDemo, startOA);
router.post("/:id/submit-section", protect, checkNotDemo, submitSection);
router.put("/:id/end", protect, checkNotDemo, endOA);
router.get("/:id/results", protect, getOAResults);
router.delete("/:id", protect, checkNotDemo, deleteOA);

module.exports = router;
