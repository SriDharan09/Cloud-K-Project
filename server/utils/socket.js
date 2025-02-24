const { Server } = require("socket.io");

let io;
const onlineUsers = new Map(); // Store online users (userCIFId -> socketId)

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Register user when they log in
    socket.on("registerUser", (userCIFId) => {
      onlineUsers.set(userCIFId, socket.id);
      console.log(`🟢 User ${userCIFId} is online (Socket ID: ${socket.id})`);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      for (const [userCIFId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userCIFId);
          console.log(`🔴 User ${userCIFId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

// ✅ Function to send real-time notifications ONLY to online users
const sendNotification = (userCIFId, notification) => {
  if (!io) return console.error("❌ Socket.io is not initialized");

  const userSocketId = onlineUsers.get(userCIFId);
  if (userSocketId) {
    io.to(userSocketId).emit("notification", notification);
    console.log(`📨 Sent real-time notification to ${userCIFId}`);
  } else {
    console.log(`⚠️ User ${userCIFId} is offline, notification stored in DB.`);
  }
};

module.exports = { initializeSocket, sendNotification, onlineUsers };
