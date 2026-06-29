require("dotenv").config();
const express = require("express");
const http = require("http");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const db = require("./models");
const { initializeSocket } = require("./utils/socket");
const { startNotificationJobs } = require("./utils/notificationService");
const allowedOrigins = require("./config/allowedOrigins");

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);
app.set("io", io);
startNotificationJobs();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
// app.use(
//   cors({
//     origin: "*",
//   }),
// );

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
const cart = require("./routers/cartRoutes");
const orderHistory = require("./routers/orderHistory");
const orderStatusWorker = require("./workers/orderStatusWorker");
const { connect } = require("./utils/messageBroker");
const notificationConsumer = require("./consumers/notificationConsumer");
const historyConsumer = require("./consumers/historyConsumer");
const pdfConsumer = require("./consumers/pdfConsumer");
const promotionConsumer = require("./consumers/promotionConsumer");
const emailConsumer = require("./consumers/emailConsumer");

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
app.use("/api/cart", cart);
app.use("/api/orderHistory", orderHistory);

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  try {
    // Step 1 — DB
    await db.sequelize.sync();
    console.log("✅ Database synced");

    // Step 2 — RabbitMQ Publiser
    await connect();

    // Step 3 — RabbitMQ Consumers
    await notificationConsumer.start();
    await historyConsumer.start();
    await promotionConsumer.start();
    console.log("✅ All consumers started");

    // Step 4 — Cron jobs
    startNotificationJobs();

    // Step 5 — Server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Bootstrap failed:", err.message);
    process.exit(1);
  }
};

bootstrap();
