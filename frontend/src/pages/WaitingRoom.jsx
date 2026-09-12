import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";

export default function WaitingRoom() {
  const { participant, participantCount, status, countdown, currentQuestion } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    if (!participant) navigate("/");
  }, [participant, navigate]);

  useEffect(() => {
    if (status === "live" && currentQuestion) navigate("/quiz");
  }, [status, currentQuestion, navigate]);

  if (!participant) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
      {status === "countdown" ? (
        <>
          <p className="font-mono text-xs text-teal mb-3">Get ready</p>
          <div className="font-display text-8xl font-bold text-amber tabular-nums">{countdown}</div>
          <p className="text-muted mt-4">The quiz is starting…</p>
        </>
      ) : (
        <>
          <div className="mb-2 text-4xl">🎉</div>
          <h1 className="font-display text-2xl font-bold">You're in, {participant.name.split(" ")[0]}!</h1>
          <p className="text-muted mt-2 text-sm font-mono">{participant.rollNumber}</p>

          <div className="mt-8 rounded-2xl border border-navy-border bg-navy-surface px-8 py-6">
            <p className="font-display text-3xl font-bold text-teal tabular-nums">{participantCount}</p>
            <p className="text-muted text-sm mt-1">participants joined</p>
          </div>

          <p className="text-muted text-sm mt-8 max-w-xs">
            Keep this tab open. The quiz begins as soon as the organizers start it on the big screen.
          </p>
        </>
      )}
    </div>
  );
}
