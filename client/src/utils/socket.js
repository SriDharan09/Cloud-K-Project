import { io } from "socket.io-client";
import { API_ENDPOINTS } from "../../config/endpoint";

const SOCKET_URL = API_ENDPOINTS.SOCKET;
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
});

export default socket;
