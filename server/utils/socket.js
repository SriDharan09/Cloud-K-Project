const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const redis = require("../config/redis");
const allowedOrigins = require("../config/allowedOrigins");

let io;

const setUserOnline = async (userCIFId, socketId) => {
  await redis.setex(`online:${userCIFId}`, 86400, socketId);
};

const setUserOffline = async (userCIFId) => {
  await redis.del(`online:${userCIFId}`);
};

const getUserSocketId = async (userCIFId) => {
  return redis.get(`online:${userCIFId}`);
};

const isUserOnline = async (userCIFId) => {
  const socketId = await getUserSocketId(userCIFId);
  return !!socketId;
};

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    console.log("📡 Socket auth:", socket.handshake.auth);

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded;

      next();
    } catch (err) {
      console.error("❌ JWT verify failed:", err.message);

      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    try {
      const userCIFId = socket.user.userCIFId;

      if (!userCIFId) {
        console.log("⚠️ No userCIFId in token");

        return socket.disconnect(true);
      }

      await setUserOnline(userCIFId, socket.id);

      socket.userCIFId = userCIFId;

      console.log(`🟢 ${userCIFId} connected (${socket.id})`);

      socket.on("disconnect", async (reason) => {
        await setUserOffline(userCIFId);

        console.log(`🔴 ${userCIFId} disconnected (${reason})`);
      });
    } catch (err) {
      console.error("❌ Socket connection error:", err.message);

      socket.disconnect(true);
    }
  });

  return io;
};

const sendNotification = async (userCIFId, notification) => {
  if (!io) {
    console.error("❌ Socket.io not initialized");
    return;
  }

  const socketId = await getUserSocketId(userCIFId);

  if (socketId) {
    io.to(socketId).emit("notification", notification);

    console.log(`📨 Real-time push → ${userCIFId}`);
  } else {
    console.log(`💾 ${userCIFId} offline — saved in DB`);
  }
};

module.exports = {
  initializeSocket,
  sendNotification,
  setUserOnline,
  setUserOffline,
  isUserOnline,
  getUserSocketId,
};
