const express = require("express");
const router = express.Router();
const { protect, checkNotDemo } = require("../middleware/auth");
const {
  createGroup,
  joinGroup,
  getUserGroups,
  getGroupDetails,
} = require("../controllers/groupController");

router.post("/", protect, checkNotDemo, createGroup);
router.post("/join", protect, checkNotDemo, joinGroup);
router.get("/", protect, getUserGroups);
router.get("/:id", protect, getGroupDetails);

module.exports = router;
