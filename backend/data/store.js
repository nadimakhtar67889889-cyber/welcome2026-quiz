const fs = require("fs");
const path = require("path");
const questions = require("./questions");

const RESULTS_FILE = path.join(__dirname, "results.json");

/**
 * Everything below lives in memory while the server runs — that's all
 * a single live event needs. Final results are also saved to
 * results.json on disk each time the quiz ends, so you have a backup
 * copy after the event even if the server restarts.
 */
const state = {
  status: "idle", // idle | waiting | countdown | live | ended
  currentQuestionIndex: -1,
  questionStartedAt: null,
  participants: new Map(), // rollNumber -> participant
  socketToRoll: new Map() // socket.id -> rollNumber
};

function resetQuiz() {
  state.status = "idle";
  state.currentQuestionIndex = -1;
  state.questionStartedAt = null;
  state.participants.clear();
  state.socketToRoll.clear();
}

function addParticipant({ name, rollNumber, department, socketId }) {
  const key = rollNumber.trim().toUpperCase();
  if (state.participants.has(key)) {
    return { error: "This roll number has already joined the quiz." };
  }
  const participant = {
    id: key,
    name: name.trim(),
    rollNumber: key,
    department: (department || "").trim(),
    socketId,
    score: 0,
    answers: {}, // questionId -> { selectedIndex, correct, timeMs, pointsEarned }
    joinedAt: Date.now(),
    finishedAt: null
  };
  state.participants.set(key, participant);
  state.socketToRoll.set(socketId, key);
  return { participant };
}

function getParticipantBySocket(socketId) {
  const roll = state.socketToRoll.get(socketId);
  if (!roll) return null;
  return state.participants.get(roll) || null;
}

function recordAnswer(rollNumber, questionId, selectedIndex, timeMs) {
  const participant = state.participants.get(rollNumber);
  if (!participant) return { error: "Participant not found." };
  if (participant.answers[questionId]) {
    return { error: "Answer already submitted for this question." };
  }

  const question = questions.find((q) => q.id === questionId);
  if (!question) return { error: "Unknown question." };

  const correct = selectedIndex === question.correctIndex;
  const pointsEarned = correct ? question.points : 0;

  participant.answers[questionId] = {
    selectedIndex,
    correct,
    timeMs,
    pointsEarned
  };
  participant.score += pointsEarned;

  return { participant, correct, pointsEarned };
}

function getLiveDistribution(questionId) {
  const counts = [0, 0, 0, 0];
  for (const p of state.participants.values()) {
    const ans = p.answers[questionId];
    if (ans && typeof ans.selectedIndex === "number") {
      counts[ans.selectedIndex] += 1;
    }
  }
  return counts;
}

function getLeaderboard(limit = 10) {
  return Array.from(state.participants.values())
    .map((p) => ({
      name: p.name,
      rollNumber: p.rollNumber,
      department: p.department,
      score: p.score,
      totalTimeMs: Object.values(p.answers).reduce((sum, a) => sum + (a.timeMs || 0), 0),
      questionsAnswered: Object.keys(p.answers).length
    }))
    // Highest score first, then fastest total time as tiebreaker
    .sort((a, b) => b.score - a.score || a.totalTimeMs - b.totalTimeMs)
    .slice(0, limit);
}

function saveResultsToDisk() {
  const fullResults = Array.from(state.participants.values()).map((p) => ({
    name: p.name,
    rollNumber: p.rollNumber,
    department: p.department,
    score: p.score,
    answers: p.answers,
    joinedAt: p.joinedAt
  }));
  const payload = {
    savedAt: new Date().toISOString(),
    totalParticipants: fullResults.length,
    results: fullResults.sort((a, b) => b.score - a.score)
  };
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(payload, null, 2));
}

module.exports = {
  state,
  resetQuiz,
  addParticipant,
  getParticipantBySocket,
  recordAnswer,
  getLiveDistribution,
  getLeaderboard,
  saveResultsToDisk
};
