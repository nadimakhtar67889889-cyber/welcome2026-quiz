import React, { useEffect } from "react";
import { useQuiz } from "../context/QuizContext.jsx";
import { socket } from "../lib/socket";
import QRCodeBox from "../components/QRCodeBox.jsx";
import Leaderboard from "../components/Leaderboard.jsx";
import Timer from "../components/Timer.jsx";

const LETTERS = ["A", "B", "C", "D"];

// Change this to your deployed join-page URL before the event.
const JOIN_URL = import.meta.env.VITE_JOIN_URL || "http://localhost:5173/";

export default function HostDisplay() {
  const { status, participantCount, countdown, currentQuestion, questionResult, leaderboard } = useQuiz();

  useEffect(() => {
    socket.emit("host:join");
  }, []);

  const revealing = Boolean(questionResult) && currentQuestion && questionResult.id === currentQuestion.id;
  const totalVotes = questionResult?.distribution?.reduce((a, b) => a + b, 0) || 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-10 py-10 text-center">
      <p className="font-mono text-sm text-teal mb-2">AWS Student Builder Group · Central University of Jammu</p>

      {status === "idle" || status === "waiting" ? (
        <div className="flex flex-col items-center">
          <h1 className="font-display text-6xl font-bold mb-8">
            Welcome <span className="text-amber">2026</span>
          </h1>
          <QRCodeBox url={JOIN_URL} size={260} />
          <p className="font-display text-2xl mt-8">Scan to join the live quiz</p>
          <p className="font-mono text-4xl text-teal mt-4 tabular-nums">{participantCount} joined</p>
        </div>
      ) : null}

      {status === "countdown" ? (
        <div>
          <p className="font-display text-3xl mb-4">Starting in…</p>
          <div className="font-display text-9xl font-bold text-amber tabular-nums">{countdown}</div>
        </div>
      ) : null}

      {status === "live" && currentQuestion ? (
        <div className="w-full max-w-3xl">
          <p className="font-mono text-muted mb-4">
            Question {currentQuestion.index + 1} / {currentQuestion.total}
          </p>
          <h2 className="font-display text-4xl font-semibold mb-8 leading-snug">{currentQuestion.question}</h2>

          {!revealing ? (
            <div className="max-w-md mx-auto mb-8">
              <Timer totalSeconds={currentQuestion.timeLimitSec} resetKey={currentQuestion.id} />
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-4 text-left">
            {currentQuestion.options.map((option, index) => {
              const count = questionResult?.distribution?.[index] || 0;
              const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
              const isCorrect = revealing && index === questionResult.correctIndex;
              return (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-xl border px-5 py-4 ${
                    isCorrect ? "border-teal bg-teal/10" : "border-navy-border bg-navy-surface"
                  }`}
                >
                  {revealing ? (
                    <div
                      className="absolute inset-y-0 left-0 bg-teal/10"
                      style={{ width: `${pct}%` }}
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-center justify-between">
                    <span>
                      <span className="font-mono text-muted mr-2">{LETTERS[index]}</span>
                      {option}
                    </span>
                    {revealing ? <span className="font-mono text-sm text-muted">{pct}%</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {status === "ended" ? (
        <div className="w-full max-w-lg">
          <h1 className="font-display text-4xl font-bold mb-8">🏆 Final Leaderboard</h1>
          {leaderboard.length > 0 ? (
            <Leaderboard entries={leaderboard} size="lg" />
          ) : (
            <p className="text-muted">Calculating results…</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
