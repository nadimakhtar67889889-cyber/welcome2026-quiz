const express = require("express");
const jwt = require("jsonwebtoken");
const { requireAdmin } = require("../middleware/adminAuth");
const { state, getLeaderboard } = require("../data/store");
const questions = require("../data/questions");

const router = express.Router();

// POST /api/admin/login  { password }
router.post("/login", (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect admin password." });
  }
  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "12h" });
  res.json({ token });
});

// GET /api/admin/status - current quiz status + participant count
router.get("/status", requireAdmin, (req, res) => {
  res.json({
    status: state.status,
    currentQuestionIndex: state.currentQuestionIndex,
    totalQuestions: questions.length,
    participantCount: state.participants.size
  });
});

// GET /api/admin/leaderboard - full leaderboard on demand (e.g. for export)
router.get("/leaderboard", requireAdmin, (req, res) => {
  res.json({ leaderboard: getLeaderboard(state.participants.size) });
});

module.exports = router;
