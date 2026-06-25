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
  statusReportPDF,
  rateFood
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, createOrder);
router.post("/rate", authMiddleware, rateFood);
router.get("/getByTxnNum", authMiddleware, getbyTxnData);
router.get("/getFilteredOrder", authMiddleware, getFilteredOrder);
router.get("/", authMiddleware, getOrders);
router.get("/report", authMiddleware, statusReportPDF);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id/status", authMiddleware, updateOrderStatus);
router.delete("/:id", authMiddleware, deleteOrder);

module.exports = router;
