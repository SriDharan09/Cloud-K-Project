const {
  notifyUser,
  notifyMultipleUsers,
} = require("../utils/notificationService");
const { Notification } = require("../models");

exports.sendNotification = async (req, res) => {
  try {
    const { userCIFId, templateKey, replacements, title, message, type, data } =
      req.body;
    if (!userCIFId)
      return res.status(400).json({ error: "userCIFId required" });
    if (!templateKey && !title)
      return res.status(400).json({ error: "templateKey or title required" });

    console.log(`📨 Sending notification to ${userCIFId}: ${title}`);

    const notification = await notifyUser(
      userCIFId,
      templateKey || null,
      replacements || {},
      title || null,
      message || null,
      type || "general",
      data || null,
    );

    return res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Bulk notifications (e.g., promotions)
exports.sendBulkNotifications = async (req, res) => {
  try {
    const { userCIFIds, type, title, message, data } = req.body;
    console.log(`📢 Sending bulk notifications to ${userCIFIds.length} users`);

    const io = req.app.get("io");
    await notifyMultipleUsers(userCIFIds, title, message, type, data);

    return res
      .status(201)
      .json({ success: true, message: "Bulk notifications sent" });
  } catch (error) {
    console.error("❌ Error sending bulk notifications:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const userCIFId = req.userCIFId;
    const notifications = await Notification.findAll({
      where: { userCIFId },
      order: [["sent_at", "DESC"]],
    });

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification)
      return res
        .status(404)
        .json({ success: false, error: "Notification not found" });

    notification.is_read = true;
    await notification.save();

    return res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("Error marking as read:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { userCIFId: req.userCIFId, is_read: false } },
    );
    return res
      .status(200)
      .json({ success: true, message: "All marked as read" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: { userCIFId: req.userCIFId, is_read: false },
    });
    return res.status(200).json({ success: true, count });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification)
      return res
        .status(404)
        .json({ success: false, error: "Notification not found" });

    await notification.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
