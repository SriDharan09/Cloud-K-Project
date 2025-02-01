const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getbyTxnData,
  getOrderById,
  getFilteredOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/auth");

// Define specific routes before general ones
router.post("/", authMiddleware, createOrder);
router.get("/getByTxnNum", authMiddleware, getbyTxnData); // Specific route
router.get("/getFilteredOrder", authMiddleware, getFilteredOrder); // Specific route
router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrderById); // General route (placed last)
router.put("/:id/status", authMiddleware, updateOrderStatus);
router.delete("/:id", authMiddleware, deleteOrder);

module.exports = router;
