import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Change to backend URL in production

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Ensure WebSocket transport is used
  withCredentials: true, // Allows CORS credentials
});

export default socket;
