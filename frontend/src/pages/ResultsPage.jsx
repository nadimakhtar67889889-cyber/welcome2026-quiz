import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import Leaderboard from "../components/Leaderboard.jsx";

export default function ResultsPage() {
  const { participant, leaderboard } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    if (!participant) navigate("/");
  }, [participant, navigate]);

  if (!participant) return null;

  const myRank = leaderboard.findIndex((e) => e.rollNumber === participant.rollNumber);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12 max-w-md mx-auto w-full">
      <p className="font-mono text-xs text-teal mb-2">Welcome 2026 — Final results</p>
      <h1 className="font-display text-3xl font-bold mb-2">🏆 Leaderboard</h1>

      {myRank >= 0 ? (
        <p className="text-muted text-sm mb-8">
          You finished <span className="text-amber font-semibold">#{myRank + 1}</span> with{" "}
          <span className="text-teal font-semibold">{leaderboard[myRank].score} points</span>.
        </p>
      ) : (
        <p className="text-muted text-sm mb-8">Thanks for playing! Here's how the top scorers did.</p>
      )}

      {leaderboard.length > 0 ? (
        <div className="w-full">
          <Leaderboard entries={leaderboard} highlightRoll={participant.rollNumber} />
        </div>
      ) : (
        <p className="text-muted text-sm">Calculating final results…</p>
      )}

      <p className="text-muted text-xs mt-10 text-center">
        Prizes will be announced on stage. Thanks for building with us! 🎉
      </p>
    </div>
  );
}
