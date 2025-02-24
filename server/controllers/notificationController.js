const {
  notifyUser,
  notifyMultipleUsers,
} = require("../utils/notificationService");
const { Notification } = require("../models");

exports.sendNotification = async (req, res) => {
  try {
    const { userCIFId, type, title, message, data } = req.body;
    templateKey = "";
    replacements = "";
    console.log(req.body);
    

    console.log(`📨 Sending notification to ${userCIFId}: ${title}`);

    const notification = await notifyUser(
      userCIFId,
      templateKey,
      replacements,
      title,
      message,
      type,
      data,
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
    await notifyMultipleUsers(io, userCIFIds, title, message, type, data);

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
