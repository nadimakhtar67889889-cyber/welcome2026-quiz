require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const adminRoutes = require("./routes/adminRoutes");
const { registerQuizSocket } = require("./sockets/quizSocket");
const questions = require("./data/questions");

const app = express();
const server = http.createServer(app);

// Accepts a comma-separated list, e.g. "https://welcome2026.vercel.app,https://welcome2026-git-main.vercel.app"
// Trailing slashes and stray whitespace are stripped so a small copy-paste
// mistake in the Render dashboard doesn't silently break CORS.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, totalQuestions: questions.length });
});

app.use("/api/admin", adminRoutes);

const io = new Server(server, {
  cors: { origin: allowedOrigins }
});

registerQuizSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Welcome 2026 quiz server running on port ${PORT}`);
});
