const express = require("express");
const router = express.Router();
const { getOrderHistory } = require("../controllers/orderHistoryController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, getOrderHistory);

module.exports = router;
