import React from "react";
import { Routes, Route } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext.jsx";

import JoinPage from "./pages/JoinPage.jsx";
import WaitingRoom from "./pages/WaitingRoom.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import HostDisplay from "./pages/HostDisplay.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

export default function App() {
  return (
    <QuizProvider>
      <Routes>
        <Route path="/" element={<JoinPage />} />
        <Route path="/waiting" element={<WaitingRoom />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/host" element={<HostDisplay />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
      </Routes>
    </QuizProvider>
  );
}
