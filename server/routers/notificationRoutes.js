const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const notificationController = require("../controllers/notificationController");

router.post("/send", authMiddleware, notificationController.sendNotification);
router.post(
  "/bulkSend",
  authMiddleware,
  notificationController.sendBulkNotifications,
);
router.get(
  "/userNotifications",
  authMiddleware,
  notificationController.getUserNotifications,
);
router.get(
  "/getUnreadCount",
  authMiddleware,
  notificationController.getUnreadCount,
);
router.put("/read/:id", authMiddleware, notificationController.markAsRead);
router.put("/read/all", authMiddleware, notificationController.markAllAsRead);

router.delete(
  "/:id",
  authMiddleware,
  notificationController.deleteNotification,
);

module.exports = router;
