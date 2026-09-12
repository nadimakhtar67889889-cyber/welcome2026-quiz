import React from "react";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ entries, highlightRoll, size = "md" }) {
  const big = size === "lg";

  return (
    <ol className="flex flex-col gap-2">
      {entries.map((entry, i) => {
        const isMe = highlightRoll && entry.rollNumber === highlightRoll;
        return (
          <li
            key={entry.rollNumber}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
              isMe ? "border-amber bg-amber/10" : "border-navy-border bg-navy-surface"
            } ${big ? "px-6 py-4" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span className={`font-mono text-muted w-8 ${big ? "text-2xl" : "text-base"}`}>
                {MEDALS[i] || `#${i + 1}`}
              </span>
              <div>
                <p className={`font-display font-semibold ${big ? "text-2xl" : "text-base"}`}>{entry.name}</p>
                {entry.department ? (
                  <p className="text-muted text-xs">{entry.department}</p>
                ) : null}
              </div>
            </div>
            <span className={`font-mono text-teal ${big ? "text-2xl" : "text-base"}`}>{entry.score} pts</span>
          </li>
        );
      })}
    </ol>
  );
}
