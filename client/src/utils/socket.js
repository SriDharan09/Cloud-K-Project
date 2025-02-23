import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export const socket = io(SOCKET_URL, { autoConnect: false });

export const connectSocket = (userCIFId) => {
    if (!socket.connected) {
      socket.connect();
      socket.emit("registerUser", userCIFId);
    }
  };

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
