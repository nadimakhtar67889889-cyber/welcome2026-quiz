import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import Timer from "../components/Timer.jsx";

const LETTERS = ["A", "B", "C", "D"];

export default function QuizPage() {
  const { participant, status, currentQuestion, questionResult, lastAnswer, submitAnswer } = useQuiz();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!participant) navigate("/");
  }, [participant, navigate]);

  useEffect(() => {
    if (status === "ended") navigate("/results");
  }, [status, navigate]);

  useEffect(() => {
    // A fresh question has arrived — reset local selection state
    setSelected(null);
    setLocked(false);
  }, [currentQuestion?.id]);

  if (!participant || !currentQuestion) return null;

  const revealing = Boolean(questionResult) && questionResult.id === currentQuestion.id;

  async function handleSelect(index) {
    if (locked || revealing) return;
    setSelected(index);
    setLocked(true);
    await submitAnswer({ questionId: currentQuestion.id, selectedIndex: index });
  }

  function optionClasses(index) {
    const base = "focus-ring w-full text-left rounded-xl border px-4 py-4 transition flex items-center gap-3";
    if (revealing) {
      if (index === questionResult.correctIndex) return `${base} border-teal bg-teal/10`;
      if (index === selected) return `${base} border-danger bg-danger/10`;
      return `${base} border-navy-border bg-navy-surface opacity-60`;
    }
    if (index === selected) return `${base} border-amber bg-amber/10`;
    return `${base} border-navy-border bg-navy-surface hover:border-teal/60`;
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 max-w-xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-xs text-muted">
          Question {currentQuestion.index + 1} / {currentQuestion.total}
        </p>
        <p className="font-mono text-xs text-amber">{currentQuestion.points} pt{currentQuestion.points > 1 ? "s" : ""}</p>
      </div>

      {!revealing ? (
        <div className="mb-6">
          <Timer totalSeconds={currentQuestion.timeLimitSec} resetKey={currentQuestion.id} />
        </div>
      ) : null}

      <h1 className="font-display text-2xl font-semibold leading-snug mb-8">{currentQuestion.question}</h1>

      <div className="flex flex-col gap-3">
        {currentQuestion.options.map((option, index) => (
          <button key={index} onClick={() => handleSelect(index)} className={optionClasses(index)}>
            <span className="font-mono text-sm text-muted w-6">{LETTERS[index]}</span>
            <span className="font-body">{option}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        {revealing ? (
          <p className={`font-display font-semibold ${lastAnswer?.correct ? "text-teal" : "text-danger"}`}>
            {selected === null
              ? "Time's up — no answer submitted"
              : lastAnswer?.correct
              ? `Correct! +${lastAnswer.pointsEarned} points`
              : "Not quite — check the highlighted answer"}
          </p>
        ) : locked ? (
          <p className="text-muted text-sm">Answer locked in. Waiting for the timer…</p>
        ) : (
          <p className="text-muted text-sm">Tap an option to answer.</p>
        )}
      </div>
    </div>
  );
}
