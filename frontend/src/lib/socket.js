import { io } from "socket.io-client";

// Point this at your deployed backend URL when you go live.
// Locally it defaults to the backend dev server on port 5000.
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"]
});
