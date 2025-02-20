require("dotenv").config();
const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const db = require("./models");
const cors = require("cors");

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});

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

const PORT = process.env.PORT || 5000;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
