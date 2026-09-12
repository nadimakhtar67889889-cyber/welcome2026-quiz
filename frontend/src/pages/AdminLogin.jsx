import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../lib/socket";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      localStorage.setItem("welcome2026_admin_token", data.token);
      navigate("/admin/panel");
    } catch (err) {
      setLoading(false);
      setError("Could not reach the server. Is the backend running?");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4">
        <div className="mb-2 text-center">
          <p className="font-mono text-xs text-teal mb-1">Organizer access</p>
          <h1 className="font-display text-2xl font-bold">Quiz control</h1>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="focus-ring w-full rounded-xl border border-navy-border bg-navy-surface px-4 py-3 text-ink"
        />
        {error ? <p className="text-danger text-sm">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="focus-ring rounded-xl bg-amber px-4 py-3 font-display font-semibold text-navy hover:bg-amber-dim disabled:opacity-60"
        >
          {loading ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
