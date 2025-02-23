const { Notification } = require("../models");
const { Op } = require("sequelize");

// Send notification to a specific user
exports.sendNotification = async (req, res) => {
  try {
    const { type, title, message, data } = req.body;
    const userCIFId = req.userCIFId;
    console.log("Notification Req" + req.body.title + ": " + req.body.message);
    

    // Save notification in the database
    const notification = await Notification.create({
      userCIFId,
      type,
      title,
      message,
      data,
      is_read: false,
    });

    // Emit to Socket.io (if user is online)
    const io = req.app.get("io");
    io.to(`user_${userCIFId}`).emit("new_notification", notification);

    return res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error("Error sending notification:", error);
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
