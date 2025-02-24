require("dotenv").config();
const express = require("express");
const http = require("http");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const db = require("./models");
const { initializeSocket } = require("./utils/socket");
const { startNotificationJobs } = require("./utils/notificationService");


const app = express();
const server = http.createServer(app);
const io = initializeSocket(server); 
app.set("io", io);
startNotificationJobs();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use(limiter);

// Routers
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

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
