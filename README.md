# Welcome 2026 — Live Quiz (AWS Student Builder Group)

A mobile-first live quiz system built for the Welcome 2026 event: students
join by scanning a QR code on their phones, the quiz runs synced in
real time across everyone, and a projector shows a live host screen with
the current question, a live answer breakdown, and the final leaderboard.

This is a working app with 20 placeholder questions already wired in —
you can run it today. Swap in the professor's real questions later by
editing **one file** (see below).

## Folder structure

```
aws-quiz-app/
├── backend/                   Node.js + Express + Socket.IO server
│   ├── server.js              Entry point
│   ├── data/
│   │   ├── questions.js       ⭐ THE FILE YOU EDIT with real questions
│   │   ├── store.js           In-memory participants + quiz state
│   │   └── results.json       Auto-created after each quiz (backup copy)
│   ├── routes/adminRoutes.js  Admin login + status REST endpoints
│   ├── sockets/quizSocket.js  Real-time quiz engine (the core logic)
│   ├── middleware/adminAuth.js
│   ├── .env.example           Copy to .env and fill in
│   └── package.json
│
└── frontend/                  React (Vite) app
    ├── src/
    │   ├── pages/
    │   │   ├── JoinPage.jsx       Student join form (what the QR code opens)
    │   │   ├── WaitingRoom.jsx    "You're in" + countdown
    │   │   ├── QuizPage.jsx       The live question screen (student's phone)
    │   │   ├── ResultsPage.jsx    Student's personal results screen
    │   │   ├── HostDisplay.jsx    Projector screen — QR, live question, leaderboard
    │   │   ├── AdminLogin.jsx     Organizer login
    │   │   └── AdminPanel.jsx     Start / End / Reset quiz controls
    │   ├── components/            Timer, Leaderboard, QRCodeBox (shared UI)
    │   ├── context/QuizContext.jsx  All real-time state, fed by socket events
    │   └── lib/socket.js          Socket.IO client + API URL config
    ├── .env.example
    └── package.json
```

## How the event flow maps to the app

| Real-world step | Screen/URL |
|---|---|
| Projector shows QR code, waiting for students | `/host` |
| Student scans QR → lands here → fills name/roll no. | `/` (JoinPage) |
| Student sees "you're in", participant count | `/waiting` (auto) |
| Organizer clicks "Start quiz" | `/admin/panel` |
| 5-second countdown on every screen | automatic |
| Live question, synced across all phones + projector | `/quiz` (auto) |
| After each question: correct answer + live vote breakdown | automatic (4s), then next question |
| After question 20: final leaderboard | `/results` (students), `/host` (projector) |

The **server** (not each phone) controls quiz timing, so all ~150 phones
and the projector stay in sync — exactly as recommended in the planning
notes. Each question has its own timer (see `questions.js`), and the app
auto-advances to the next question a few seconds after each one closes.

## Running it locally

You need Node.js 18+ installed.

**1. Backend**
```bash
cd backend
cp .env.example .env
# open .env and set ADMIN_PASSWORD and JWT_SECRET to your own values
npm install
npm run dev
```
This starts the server on `http://localhost:5000`.

**2. Frontend** (in a second terminal)
```bash
cd frontend
npm install
npm run dev
```
This starts the app on `http://localhost:5173`.

**3. Try it out**
- Open `http://localhost:5173/` in a few browser tabs (or your phone,
  if it's on the same Wi-Fi as your laptop — use your laptop's local IP
  instead of `localhost`) and join with different roll numbers.
- Open `http://localhost:5173/host` on another screen — this is the
  projector view.
- Open `http://localhost:5173/admin`, log in with the password you set
  in `.env`, and click **Start quiz**.

## ⭐ Updating the real questions from the professor

Open **`backend/data/questions.js`**. Each question is one object:

```js
{
  id: "q1",
  section: "lecture",           // just a label, doesn't affect scoring
  question: "Your real question text here?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctIndex: 1,              // 0 = first option, 1 = second, etc.
  points: 1,
  timeLimitSec: 20
}
```

Replace the `question`, `options`, and `correctIndex` for each of the 20
entries. You don't need to touch any other file — the join page, quiz
screen, host display, and admin panel all read from this file
automatically. Questions currently marked `[PLACEHOLDER — replace after
lecture]` are the ones that depend on the actual lecture content; the
AWS/cloud fundamentals and scenario questions are already real and can
stay as-is if you like them.

If you end up with more or fewer than 20 questions, that's fine too —
nothing else needs to change, the app reads `questions.length`
automatically.

## Before the real event (150 students)

A few things worth doing ahead of time, not required for a local test:

1. **Deploy both apps somewhere reachable from phones on the venue
   Wi-Fi** — e.g. backend on Render/Railway, frontend on Vercel/Netlify.
   Update `frontend/.env` (`VITE_SOCKET_URL`, `VITE_API_URL`,
   `VITE_JOIN_URL`) to point at the deployed backend/frontend URLs, and
   `backend/.env`'s `CLIENT_ORIGIN` to the deployed frontend URL.
2. **Test with a real crowd size once** if you can (ask 20-30 friends to
   join at once) — the server holds everything in memory, which easily
   handles 150 participants on a single Node process.
3. **Change `ADMIN_PASSWORD` and `JWT_SECRET`** in the backend `.env` to
   your own values before the event — don't use the example ones.
4. **Print the QR code** pointing at your deployed join URL (not
   `localhost`) — `HostDisplay.jsx` reads it from `VITE_JOIN_URL`.
5. Results are saved automatically to `backend/data/results.json` when
   the quiz ends, as a backup you can open after the event.

## Deploying (Render + Vercel)

See the step-by-step walkthrough in chat. Quick reference once both are
live:

- Render env vars: `ADMIN_PASSWORD`, `JWT_SECRET`, `CLIENT_ORIGIN` (your
  Vercel URL, no trailing slash). Render sets `PORT` itself.
- Vercel env vars: `VITE_SOCKET_URL` and `VITE_API_URL` (your Render
  URL), `VITE_JOIN_URL` (your Vercel URL, with trailing slash).
- `render.yaml` at the repo root lets you deploy the backend as a
  Blueprint instead of clicking through the dashboard manually.
- `frontend/vercel.json` makes direct links like `/host` and
  `/admin` work — without it, Vercel 404s on anything but `/`.
- Keep the backend at **1 instance** — quiz state lives in memory, so
  more than one instance would split participants across two servers.

## Tech stack

- **Backend:** Node.js, Express, Socket.IO, JWT for admin auth. No
  database required — quiz state lives in memory for the event and
  results are snapshotted to a JSON file when the quiz ends.
- **Frontend:** React + Vite, Tailwind CSS, Socket.IO client,
  `qrcode.react` for the QR code, `react-router-dom` for navigation.
