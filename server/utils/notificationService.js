const { Notification, NotificationTemplate, User } = require("../models");
const { sendNotification, onlineUsers } = require("../utils/socket");
const cron = require("node-cron");
const { Op } = require("sequelize");

// ✅ Fetch notification template and replace placeholders
const getNotificationTemplate = async (key, replacements = {}) => {
  const template = await NotificationTemplate.findOne({ where: { key } });

  if (!template) {
    console.warn(`⚠️ Template '${key}' not found in DB.`);
    return null;
  }

  let { title, message, type } = template;

  // Replace placeholders dynamically
  Object.keys(replacements).forEach((key) => {
    title = title.replace(`{{${key}}}`, replacements[key]);
    message = message.replace(`{{${key}}}`, replacements[key]);
  });

  return { title, message, type };
};

const notifyUser = async (
  userCIFId,
  templateKey,
  replacements = {},
  title,
  message,
  type = "general",
  data = null,
) => {
  try {
    const users = await User.findOne({
      where: { isActive: true },
      attributes: ["userCIFId"],
    });
    if (!users) {
      console.warn(
        `⚠️ User ${userCIFId} not found or inactive. Skipping notification.`,
      );
      return null;
    }

    if (templateKey) {
      const template = await getNotificationTemplate(templateKey, replacements);
      if (!template) return null;
      title = template.title;
      message = template.message;
      type = template.type;
    }

    const notification = await Notification.create({
      userCIFId,
      title,
      message,
      type,
      data,
      is_read: false,
    });

    console.log(`📨 Notification sent to ${userCIFId}: ${title}`);

    if (onlineUsers.has(userCIFId)) {
      sendNotification(userCIFId, notification);
    }

    return notification;
  } catch (error) {
    console.error("❌ Error sending notificationService:", error);
  }
};

// 🔄 Notify multiple users at once
const notifyMultipleUsers = async (
  userCIFIds,
  title,
  message,
  type = "general",
  data = null,
) => {
  await Promise.all(
    userCIFIds.map((id) =>
      notifyUser(id, null, {}, title, message, type, data),
    ),
  );
};

// 🔄 Send Order Status Notification (Uses Template)
const sendOrderNotification = async (orderId, userCIFId, status) => {
  await notifyUser({
    userCIFId,
    templateKey: "orderStatusUpdate",
    replacements: { orderId, status },
    data: { orderId, status },
  });
};

// 🔄 Send Bulk Promotional Notifications
const sendBulkPromotion = async () => {
  const users = await User.findAll({
    where: { isActive: true },
    attributes: ["userCIFId"],
  });
  console.log(users.length);

  if (!users.length) {
    return console.log("⚠️ No active users.");
  }

  const promotionTemplates = await NotificationTemplate.findAll({
    where: { type: "promotion" },
  });

  const generalTemplates = await NotificationTemplate.findAll({
    where: { type: "general" },
  });

  const templates = [...promotionTemplates, ...generalTemplates];

  if (!templates.length) {
    return console.log("⚠️ No promotion templates available.");
  } else {
    console.log(templates);
  }

  await Promise.all(
    users.map(async (user) => {
      const randomTemplate =
        templates[Math.floor(Math.random() * templates.length)];
      const replacements = {};

      await notifyUser(user.userCIFId, randomTemplate.key, replacements);
    }),
  );

  console.log(`✅ Sent promotional notifications to ${users.length} users.`);
};

// ⏰ Schedule Automated Notifications
const startNotificationJobs = () => {
  cron.schedule("0 12,20 * * *", async () => {
    console.log("📢 Sending bulk promotional notifications...");
    await sendBulkPromotion();
  });
  cron.schedule("* * * * *", () => {
    console.table(onlineUsers);
  });
};

module.exports = {
  notifyUser,
  notifyMultipleUsers,
  sendOrderNotification,
  startNotificationJobs,
};
