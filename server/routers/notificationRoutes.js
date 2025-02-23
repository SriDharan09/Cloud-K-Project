const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const notificationController = require("../controllers/notificationController");

router.post("/send", authMiddleware, notificationController.sendNotification); // Send notification
router.get(
  "/userNotifications",
  authMiddleware,
  notificationController.getUserNotifications
);
router.put("/read/:id", authMiddleware, notificationController.markAsRead); // Mark notification as read
router.delete(
  "/:id",
  authMiddleware,
  notificationController.deleteNotification
);

module.exports = router;
