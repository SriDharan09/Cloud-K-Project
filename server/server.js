require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");
const db = require("./models");
const cors = require("cors");
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
const onlineUsers = new Map();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const authRoutes = require("./routers/auth");
const categoryRoutes = require("./routers/category");
const menuRoutes = require("./routers/menu");
const orderRoutes = require("./routers/order");
const userRoutes = require("./routers/user");
const branchRoutes = require("./routers/branch");
const userAddressRouter = require("./routers/userAddress");
const reviewRouter = require("./routers/review");
const offerRouter = require("./routers/offer");
const profileRoutes = require("./routers/profile");
const notificationRoutes = require("./routers/notificationRoutes");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
});

app.set("io", io);

app.use(limiter);
app.use(express.json()); // Parses JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parses form data

//app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/userAddresses", userAddressRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/offers", offerRouter);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register user with userCIFId
  socket.on("registerUser", (userCIFId) => {
    onlineUsers.set(userCIFId, socket.id);
    console.log(`User ${userCIFId} is online`);
  });

  // Send notification to a specific user
  socket.on("sendNotification", ({ userCIFId, message }) => {
    const userSocketId = onlineUsers.get(userCIFId);
    if (userSocketId) {
      io.to(userSocketId).emit("notification", message);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    });
    console.log("User disconnected:", socket.id);
  });
});

const sendNotification = async (userCIFId, message, type = "General") => {
  const userSocketId = onlineUsers.get(userCIFId);

  // Save to DB
  await Notification.create({ userCIFId, message, type });

  // Send via Socket.io if user is online
  if (userSocketId) {
    io.to(userSocketId).emit("notification", message);
  }
};

const PORT = process.env.PORT || 5000;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
