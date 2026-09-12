import React, { useEffect, useState } from "react";

/**
 * Client-side visual countdown. The server is the real source of truth
 * for when a question closes — this bar just gives students a sense of
 * urgency and resets automatically whenever `resetKey` changes.
 */
export default function Timer({ totalSeconds, resetKey, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const remaining = Math.max(0, Math.ceil(totalSeconds - elapsed));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 200);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, totalSeconds]);

  const pct = Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));
  const urgent = secondsLeft <= 5;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-xs text-muted">time left</span>
        <span className={`font-mono text-sm ${urgent ? "text-danger" : "text-teal"}`}>{secondsLeft}s</span>
      </div>
      <div className="h-2 w-full rounded-full bg-navy-light overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-200 ease-linear ${
            urgent ? "bg-danger" : "bg-teal"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
