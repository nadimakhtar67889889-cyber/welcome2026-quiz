import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../lib/socket";

const QuizContext = createContext(null);

const STORAGE_KEY = "welcome2026_participant";

export function QuizProvider({ children }) {
  const [participant, setParticipant] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [status, setStatus] = useState("idle"); // idle | waiting | countdown | live | ended
  const [participantCount, setParticipantCount] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionResult, setQuestionResult] = useState(null); // correctIndex + distribution after a question ends
  const [lastAnswer, setLastAnswer] = useState(null); // this student's own last answer feedback
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    function onParticipantsUpdate({ count }) {
      setParticipantCount(count);
    }
    function onCountdown({ seconds }) {
      setStatus("countdown");
      setCountdown(seconds);
    }
    function onQuestion(payload) {
      setStatus("live");
      setCountdown(null);
      setCurrentQuestion(payload);
      setQuestionResult(null);
      setLastAnswer(null);
    }
    function onQuestionEnded(payload) {
      setQuestionResult(payload);
    }
    function onDistribution(payload) {
      setQuestionResult((prev) =>
        prev && prev.id === payload.questionId ? { ...prev, distribution: payload.distribution } : prev
      );
    }
    function onEnded() {
      setStatus("ended");
      setCurrentQuestion(null);
    }
    function onLeaderboard({ leaderboard }) {
      setLeaderboard(leaderboard);
    }
    function onReset() {
      setStatus("idle");
      setCurrentQuestion(null);
      setQuestionResult(null);
      setLeaderboard([]);
      setParticipant(null);
      sessionStorage.removeItem(STORAGE_KEY);
    }

    socket.on("participants:update", onParticipantsUpdate);
    socket.on("quiz:countdown", onCountdown);
    socket.on("quiz:question", onQuestion);
    socket.on("quiz:questionEnded", onQuestionEnded);
    socket.on("live:distribution", onDistribution);
    socket.on("quiz:ended", onEnded);
    socket.on("quiz:leaderboard", onLeaderboard);
    socket.on("quiz:reset", onReset);

    return () => {
      socket.off("participants:update", onParticipantsUpdate);
      socket.off("quiz:countdown", onCountdown);
      socket.off("quiz:question", onQuestion);
      socket.off("quiz:questionEnded", onQuestionEnded);
      socket.off("live:distribution", onDistribution);
      socket.off("quiz:ended", onEnded);
      socket.off("quiz:leaderboard", onLeaderboard);
      socket.off("quiz:reset", onReset);
    };
  }, []);

  function join({ name, rollNumber, department }) {
    return new Promise((resolve) => {
      socket.emit("student:join", { name, rollNumber, department }, (response) => {
        if (response?.participant) {
          setParticipant(response.participant);
          setStatus(response.status || "waiting");
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(response.participant));
        }
        resolve(response);
      });
    });
  }

  function submitAnswer({ questionId, selectedIndex }) {
    return new Promise((resolve) => {
      socket.emit("student:answer", { questionId, selectedIndex }, (response) => {
        if (!response?.error) setLastAnswer({ selectedIndex, ...response });
        resolve(response);
      });
    });
  }

  const value = {
    participant,
    status,
    participantCount,
    countdown,
    currentQuestion,
    questionResult,
    lastAnswer,
    leaderboard,
    join,
    submitAnswer
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside <QuizProvider>");
  return ctx;
}
