import { useEffect, useRef } from "react";
import socket from "./socket";
import { useSelector, useDispatch } from "react-redux";
import { addNotification } from "../redux/slice/notificationSlice";
import { useNotification } from "../context/NotificationProvider";

const NotificationListener = () => {
  const userCIFId = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();
  const openNotification = useNotification();

  useEffect(() => {
    if (!userCIFId || !token) {
      socket.disconnect();
      return;
    }
    console.log("📡 Socket connecting...");
    console.log("📡 Token:", token);
    socket.auth = { token };
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Socket error:", err.message);
    });

    socket.on("notification", (data) => {
      console.log("📩 Notification:", data);

      openNotification(data.status || 200, data.title, data.message, {
        placement: "top",
        duration: 5,
        isSocket: true,
      });

      dispatch(addNotification(data));
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected:", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("notification");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [userCIFId, token]);

  return null;
};

export default NotificationListener;
