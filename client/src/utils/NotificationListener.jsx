import { useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { addNotification } from "../redux/slice/notificationSlice";
import { useNotification } from "../context/NotificationProvider";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: false,
});

const NotificationListener = () => {
  const userCIFId = useSelector((state) => state.auth.user?.cifId);
  const dispatch = useDispatch();
  const openNotification = useNotification();

  useEffect(() => {
    if (userCIFId) {
      socket.connect();

      const registerUser = () => {
        console.log("📡 Registering user:", userCIFId);
        socket.emit("registerUser", userCIFId);
      };

      registerUser();
      socket.on("connect", registerUser);
      socket.on("notification", (data) => {
        console.log("📩 New notification received:", data);
        openNotification(data.status || 200, data.title, data.message, {
          placement: "top",
          duration: 5,
          isSocket: true,
        });
        dispatch(addNotification(data));
      });

      socket.on("disconnect", () =>
        console.log("❌ Disconnected from Socket.io")
      );
    } else {
      socket.disconnect();
      console.log("🚪 User logged out, socket disconnected.");
    }

    return () => {
      socket.off("connect");
      socket.off("notification");
      socket.off("disconnect");
    };
  }, [userCIFId, dispatch]);

  return null;
};

export default NotificationListener;
