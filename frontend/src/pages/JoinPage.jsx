import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";

export default function JoinPage() {
  const { join, participant } = useQuiz();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (participant) navigate("/waiting");
  }, [participant, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !rollNumber.trim()) {
      setError("Please enter your name and roll number.");
      return;
    }
    setLoading(true);
    const response = await join({ name, rollNumber, department });
    setLoading(false);
    if (response?.error) {
      setError(response.error);
      return;
    }
    navigate("/waiting");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs text-teal mb-2">AWS Student Builder Group · Central University of Jammu</p>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Welcome <span className="text-amber">2026</span>
          </h1>
          <p className="text-muted mt-2 text-sm">Live quiz — join with your details to take part.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm text-muted mb-1.5">
              Full name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nadim Akhtar"
              className="focus-ring w-full rounded-xl border border-navy-border bg-navy-surface px-4 py-3 text-ink placeholder:text-muted/60"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="roll" className="block text-sm text-muted mb-1.5">
              Roll number
            </label>
            <input
              id="roll"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="e.g. 26BEECE04"
              className="focus-ring w-full rounded-xl border border-navy-border bg-navy-surface px-4 py-3 text-ink placeholder:text-muted/60 font-mono"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="dept" className="block text-sm text-muted mb-1.5">
              Department / year <span className="text-muted/60">(optional)</span>
            </label>
            <input
              id="dept"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. B.Tech ECE, 1st year"
              className="focus-ring w-full rounded-xl border border-navy-border bg-navy-surface px-4 py-3 text-ink placeholder:text-muted/60"
            />
          </div>

          {error ? <p className="text-danger text-sm">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-2 rounded-xl bg-amber px-4 py-3 font-display font-semibold text-navy transition hover:bg-amber-dim disabled:opacity-60"
          >
            {loading ? "Joining…" : "Join quiz"}
          </button>
        </form>

        <p className="text-muted text-xs text-center mt-6">
          Top scorers win prizes. Stay on this page once you're in — the quiz starts when the organizers begin it.
        </p>
      </div>
    </div>
  );
}
