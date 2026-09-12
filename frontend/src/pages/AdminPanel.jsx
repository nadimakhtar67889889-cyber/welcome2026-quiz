import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import { socket } from "../lib/socket";
import Leaderboard from "../components/Leaderboard.jsx";

export default function AdminPanel() {
  const { status, participantCount, currentQuestion, questionResult, leaderboard } = useQuiz();
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("welcome2026_admin_token");

  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }
    socket.emit("admin:auth", { token }, (response) => {
      if (response?.error) {
        localStorage.removeItem("welcome2026_admin_token");
        navigate("/admin");
        return;
      }
      setAuthed(true);
    });
  }, [token, navigate]);

  function runAction(event, confirmMsg) {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setBusy(true);
    setMessage("");
    socket.emit(event, { token }, (response) => {
      setBusy(false);
      if (response?.error) setMessage(response.error);
    });
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen px-6 py-10 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-teal mb-1">Welcome 2026 — Quiz control</p>
          <h1 className="font-display text-2xl font-bold">Organizer panel</h1>
        </div>
        <span className="font-mono text-xs rounded-full border border-navy-border px-3 py-1 text-muted uppercase">
          {status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-navy-border bg-navy-surface px-5 py-4">
          <p className="font-display text-3xl font-bold text-teal tabular-nums">{participantCount}</p>
          <p className="text-muted text-sm">participants joined</p>
        </div>
        <div className="rounded-xl border border-navy-border bg-navy-surface px-5 py-4">
          <p className="font-display text-3xl font-bold text-amber tabular-nums">
            {currentQuestion ? `${currentQuestion.index + 1}/${currentQuestion.total}` : "—"}
          </p>
          <p className="text-muted text-sm">current question</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <button
          disabled={busy || status === "live" || status === "countdown"}
          onClick={() => runAction("admin:start")}
          className="focus-ring rounded-xl bg-amber px-4 py-3 font-display font-semibold text-navy hover:bg-amber-dim disabled:opacity-40"
        >
          ▶ Start quiz
        </button>
        <button
          disabled={busy || status === "idle" || status === "ended"}
          onClick={() => runAction("admin:end", "End the quiz right now and show final results?")}
          className="focus-ring rounded-xl border border-danger px-4 py-3 font-display font-semibold text-danger hover:bg-danger/10 disabled:opacity-40"
        >
          ■ End quiz now
        </button>
        <button
          disabled={busy}
          onClick={() => runAction("admin:reset", "Reset everything? This clears all participants and scores.")}
          className="focus-ring rounded-xl border border-navy-border px-4 py-3 font-display font-semibold text-muted hover:border-teal hover:text-teal disabled:opacity-40"
        >
          ↺ Reset quiz
        </button>
        {message ? <p className="text-danger text-sm">{message}</p> : null}
      </div>

      {currentQuestion ? (
        <div className="rounded-xl border border-navy-border bg-navy-surface px-5 py-4 mb-8">
          <p className="text-muted text-xs mb-2">Live question</p>
          <p className="font-display font-semibold mb-3">{currentQuestion.question}</p>
          {questionResult?.id === currentQuestion.id ? (
            <div className="flex flex-col gap-1 font-mono text-sm text-muted">
              {currentQuestion.options.map((opt, i) => (
                <div key={i} className={i === questionResult.correctIndex ? "text-teal" : ""}>
                  {opt}: {questionResult.distribution?.[i] || 0} votes
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm">Question is live — waiting for the timer to end.</p>
          )}
        </div>
      ) : null}

      {status === "ended" && leaderboard.length > 0 ? (
        <div>
          <p className="font-display font-semibold mb-3">Final leaderboard</p>
          <Leaderboard entries={leaderboard} />
        </div>
      ) : null}
    </div>
  );
}
