const express = require("express");
const router = express.Router();
const { protect, checkNotDemo } = require("../middleware/auth");
const {
  createGroup,
  joinGroup,
  getUserGroups,
  getGroupDetails,
  deleteGroup,
} = require("../controllers/groupController");

router.post("/", protect, checkNotDemo, createGroup);
router.post("/join", protect, checkNotDemo, joinGroup);
router.get("/", protect, getUserGroups);
router.get("/:id", protect, getGroupDetails);
router.delete("/:id", protect, checkNotDemo, deleteGroup);

module.exports = router;
