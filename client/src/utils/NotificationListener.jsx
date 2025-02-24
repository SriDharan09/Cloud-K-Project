import { useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { addNotification } from "../redux/slice/notificationSlice";

// Connect to backend socket server
const socket = io("http://localhost:5000", { transports: ["websocket"] });

const NotificationListener = () => {
  const userCIFId = useSelector((state) => state.auth.user?.cifId);
  console.log("User CIF ID:", userCIFId);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (userCIFId) {
      socket.emit("registerUser", userCIFId);
      console.log("📡 Registered user:", userCIFId);

      socket.on("notification", (data) => {
        console.log("📩 New notification received:", data);
        dispatch(addNotification(data));
      });

      socket.on("connect", () => console.log("✅ Connected to Socket.io"));
      socket.on("disconnect", () =>
        console.log("❌ Disconnected from Socket.io")
      );
    }

    return () => {
      socket.off("notification");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [userCIFId, dispatch]);

  return null;
};

export default NotificationListener;
