const questions = require("../data/questions");
const { verifyAdminToken } = require("../middleware/adminAuth");
const {
  state,
  resetQuiz,
  addParticipant,
  getParticipantBySocket,
  recordAnswer,
  getLiveDistribution,
  getLeaderboard,
  saveResultsToDisk
} = require("../data/store");

const REVEAL_MS = 4000; // how long the "correct answer" screen shows before the next question
const COUNTDOWN_SECONDS = 5;

let activeTimer = null;

function clearActiveTimer() {
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
}

function broadcastParticipantCount(io) {
  io.emit("participants:update", { count: state.participants.size });
}

function sendQuestion(io, index) {
  const q = questions[index];
  state.currentQuestionIndex = index;
  state.questionStartedAt = Date.now();

  io.to("students").to("host").to("admins").emit("quiz:question", {
    index,
    total: questions.length,
    id: q.id,
    section: q.section,
    question: q.question,
    options: q.options,
    timeLimitSec: q.timeLimitSec,
    points: q.points
  });

  // Live answer counts, for the host screen + admin panel only
  activeTimer = setTimeout(() => endQuestion(io, index), q.timeLimitSec * 1000);
}

function endQuestion(io, index) {
  clearActiveTimer();
  const q = questions[index];
  const distribution = getLiveDistribution(q.id);

  io.to("students").to("host").to("admins").emit("quiz:questionEnded", {
    id: q.id,
    correctIndex: q.correctIndex,
    distribution
  });

  activeTimer = setTimeout(() => advance(io, index), REVEAL_MS);
}

function advance(io, previousIndex) {
  clearActiveTimer();
  const nextIndex = previousIndex + 1;
  if (nextIndex >= questions.length) {
    finishQuiz(io);
  } else {
    sendQuestion(io, nextIndex);
  }
}

function finishQuiz(io) {
  state.status = "ended";
  saveResultsToDisk();
  const leaderboard = getLeaderboard(10);
  io.to("students").to("host").to("admins").emit("quiz:ended");
  io.to("students").to("host").to("admins").emit("quiz:leaderboard", { leaderboard });
}

function startQuiz(io) {
  if (state.participants.size === 0) {
    return { error: "No participants have joined yet." };
  }
  state.status = "countdown";
  let secondsLeft = COUNTDOWN_SECONDS;
  io.to("students").to("host").to("admins").emit("quiz:countdown", { seconds: secondsLeft });

  const tick = () => {
    secondsLeft -= 1;
    if (secondsLeft <= 0) {
      state.status = "live";
      sendQuestion(io, 0);
    } else {
      io.to("students").to("host").to("admins").emit("quiz:countdown", { seconds: secondsLeft });
      activeTimer = setTimeout(tick, 1000);
    }
  };
  activeTimer = setTimeout(tick, 1000);
  return { ok: true };
}

function endQuizNow(io) {
  clearActiveTimer();
  finishQuiz(io);
}

function registerQuizSocket(io) {
  io.on("connection", (socket) => {
    // ---------------- Student events ----------------

    socket.on("student:join", ({ name, rollNumber, department }, callback) => {
      if (!name || !rollNumber) {
        return callback?.({ error: "Name and roll number are required." });
      }
      if (state.status === "live" || state.status === "countdown") {
        return callback?.({ error: "The quiz has already started. Please wait for the next round." });
      }
      const result = addParticipant({ name, rollNumber, department, socketId: socket.id });
      if (result.error) {
        return callback?.(result);
      }
      socket.join("students");
      broadcastParticipantCount(io);
      callback?.({ participant: result.participant, status: state.status });
    });

    socket.on("student:answer", ({ questionId, selectedIndex }, callback) => {
      const participant = getParticipantBySocket(socket.id);
      if (!participant) return callback?.({ error: "You are not registered for this quiz." });
      if (!state.questionStartedAt) return callback?.({ error: "No active question." });

      const timeMs = Date.now() - state.questionStartedAt;
      const result = recordAnswer(participant.rollNumber, questionId, selectedIndex, timeMs);
      if (result.error) return callback?.(result);

      callback?.({ correct: result.correct, pointsEarned: result.pointsEarned, score: result.participant.score });

      // Update the live bar chart for host + admin only
      const distribution = getLiveDistribution(questionId);
      io.to("host").to("admins").emit("live:distribution", { questionId, distribution });
    });

    // ---------------- Host display (projector) ----------------
    socket.on("host:join", () => {
      socket.join("host");
      socket.emit("participants:update", { count: state.participants.size });
    });

    // ---------------- Admin events ----------------
    socket.on("admin:auth", ({ token }, callback) => {
      if (!verifyAdminToken(token)) return callback?.({ error: "Invalid admin token." });
      socket.join("admins");
      callback?.({
        ok: true,
        status: state.status,
        participantCount: state.participants.size
      });
    });

    socket.on("admin:start", ({ token }, callback) => {
      if (!verifyAdminToken(token)) return callback?.({ error: "Invalid admin token." });
      const result = startQuiz(io);
      callback?.(result);
    });

    socket.on("admin:end", ({ token }, callback) => {
      if (!verifyAdminToken(token)) return callback?.({ error: "Invalid admin token." });
      endQuizNow(io);
      callback?.({ ok: true });
    });

    socket.on("admin:reset", ({ token }, callback) => {
      if (!verifyAdminToken(token)) return callback?.({ error: "Invalid admin token." });
      clearActiveTimer();
      resetQuiz();
      io.emit("quiz:reset");
      broadcastParticipantCount(io);
      callback?.({ ok: true });
    });

    socket.on("disconnect", () => {
      // Participants stay registered (so refreshing the phone won't drop
      // them mid-quiz) — we only clean up host/admin room membership.
    });
  });
}

module.exports = { registerQuizSocket };
