const { Notification, User } = require("../models");
const { sendNotification, onlineUsers } = require("../utils/socket");

// ✅ Store notification in DB and send via Socket.io (ONLY to online users)
const notifyUser = async (
  userCIFId,
  title,
  message,
  type = "general",
  data = null
) => {
  try {
    const user = await User.findOne({ where: { userCIFId } });
    if (!user) {
      console.warn(
        `⚠️ User with CIF ID ${userCIFId} not found. Skipping notification.`
      );
      return null; // Stop execution without throwing an error
    }
    // Save notification in DB
    const notification = await Notification.create({
      userCIFId,
      title,
      message,
      type,
      data,
      is_read: false,
    });

    // Send real-time notification if user is online
    sendNotification(userCIFId, notification);

    return notification;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
  }
};

// ✅ Bulk notifications (ONLY sends real-time to online users)
const notifyMultipleUsers = async (
  userCIFIds,
  title,
  message,
  type = "general",
  data = null
) => {
  for (const userCIFId of userCIFIds) {
    await notifyUser(userCIFId, title, message, type, data);
  }
};

// ✅ Send random notification every 5 seconds (for testing)
const messages = [
  {
    title: "Limited Offer!",
    message: "Get 20% off on all orders today!",
    type: "promotion",
  },
  {
    title: "New Menu Alert",
    message: "Try our newly added dishes!",
    type: "general",
  },
  {
    title: "Order Reminder",
    message: "Haven't ordered in a while? Grab your favorite meal now!",
    type: "reminder",
  },
];

const sendRandomNotification = async () => {
  const onlineUserIds = Array.from(onlineUsers.keys()); // Get list of online users
  if (onlineUserIds.length === 0) {
    console.log("⚠️ No online users to send notifications.");
    return;
  }

  const randomUserCIFId =
    onlineUserIds[Math.floor(Math.random() * onlineUserIds.length)];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  await notifyUser(
    randomUserCIFId,
    randomMessage.title,
    randomMessage.message,
    randomMessage.type
  );
};

// ✅ Start random notifications every 5 seconds
const startRandomNotificationJob = () => {
  setInterval(() => sendRandomNotification(), 5 * 100000);
};

module.exports = {
  notifyUser,
  notifyMultipleUsers,
  startRandomNotificationJob,
};
