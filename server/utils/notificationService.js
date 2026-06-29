const { Notification, NotificationTemplate, User } = require("../models");
const { sendNotification, isUserOnline } = require("../utils/socket");
const { publish } = require("./messageBroker");
const redis = require("../config/redis");
const cron = require("node-cron");

const getNotificationTemplate = async (key, replacements = {}) => {
  const cacheKey = `template:${key}`;

  try {
    const cached = await redis.get(cacheKey);
    let template = cached ? JSON.parse(cached) : null;

    if (!template) {
      const row = await NotificationTemplate.findOne({ where: { key } });
      if (!row) {
        console.warn(`⚠️ Template '${key}' not found in DB`);
        return null;
      }
      template = { title: row.title, message: row.message, type: row.type };
      await redis.setex(cacheKey, 3600, JSON.stringify(template)); // cache 1hr
      console.log(`📋 Template '${key}' cached in Redis`);
    }

    let { title, message, type } = template;
    Object.keys(replacements).forEach((placeholder) => {
      const regex = new RegExp(`{{${placeholder}}}`, "g");
      title = title.replace(regex, replacements[placeholder] ?? "");
      message = message.replace(regex, replacements[placeholder] ?? "");
    });

    return { title, message, type };
  } catch (err) {
    console.error(`❌ Template fetch error for '${key}':`, err.message);
    return null;
  }
};

const notifyUser = async (
  userCIFId,
  templateKey = null,
  replacements = {},
  title = null,
  message = null,
  type = "general",
  data = null,
) => {
  try {
    const user = await User.findOne({
      where: { userCIFId, isActive: true },
      attributes: ["userCIFId"],
    });

    if (!user) {
      console.warn(`⚠️ User '${userCIFId}' not found or inactive — skipping`);
      return null;
    }

    if (templateKey) {
      const template = await getNotificationTemplate(templateKey, replacements);
      if (!template) return null;
      title = template.title;
      message = template.message;
      type = template.type;
    }

    if (!title || !message) {
      console.warn(`⚠️ Missing title/message for '${userCIFId}' — skipping`);
      return null;
    }

    const notification = await Notification.create({
      userCIFId,
      title,
      message,
      type,
      data,
      is_read: false,
    });

    if (await isUserOnline(userCIFId)) {
      await sendNotification(userCIFId, notification);
      console.log(`⚡ Real-time push → ${userCIFId}: "${title}"`);
    } else {
      console.log(`💾 Stored for '${userCIFId}' — will receive on next login`);
    }

    return notification;
  } catch (err) {
    console.error(`❌ notifyUser error [${userCIFId}]:`, err.message);
    return null;
  }
};

const notifyMultipleUsers = async (
  userCIFIds,
  title,
  message,
  type = "general",
  data = null,
  batchSize = 10, // process 10 at a time
) => {
  if (!userCIFIds?.length) return;

  const chunks = [];
  for (let i = 0; i < userCIFIds.length; i += batchSize) {
    chunks.push(userCIFIds.slice(i, i + batchSize));
  }

  let sent = 0;
  for (const chunk of chunks) {
    await Promise.all(
      chunk.map((id) => notifyUser(id, null, {}, title, message, type, data)),
    );
    sent += chunk.length;
    console.log(`📨 Batch sent: ${sent}/${userCIFIds.length}`);
  }

  console.log(`✅ notifyMultipleUsers complete — ${sent} notifications`);
};

const sendOrderNotification = async (
  orderId,
  userCIFId,
  status,
  notificationKey = "orderStatusUpdate",
) => {
  return notifyUser(
    userCIFId, // arg1 — who
    notificationKey, // arg2 — which template
    { orderId, status }, // arg3 — replacements for {{orderId}}, {{status}}
    null, // arg4 — title from template
    null, // arg5 — message from template
    "order_status", // arg6 — type matches your ENUM
    { orderId, status }, // arg7 — data payload for frontend
  );
};

const sendBulkPromotion = async () => {
  try {
    const [users, templates] = await Promise.all([
      User.findAll({ where: { isActive: true }, attributes: ["userCIFId"] }),
      NotificationTemplate.findAll({
        where: { type: ["promotion", "general"] },
      }),
    ]);

    if (!users.length) return console.log("⚠️ No active users for promotion");
    if (!templates.length)
      return console.log("⚠️ No promotion templates found");

    // ✅ Publish to queue — consumer processes one by one, no DB flood
    let queued = 0;
    for (const user of users) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      publish("promotion.send", {
        userCIFId: user.userCIFId,
        templateKey: template.key,
      });
      queued++;
    }

    console.log(`✅ Queued ${queued} promotional notifications`);
  } catch (err) {
    console.error("❌ sendBulkPromotion error:", err.message);
  }
};
const invalidateTemplateCache = async (key) => {
  await redis.del(`template:${key}`);
  console.log(`🗑️ Template cache cleared: '${key}'`);
};

const invalidateAllTemplateCache = async () => {
  const keys = await redis.keys("template:*");
  if (keys.length) {
    await redis.del(...keys);
    console.log(`🗑️ Cleared ${keys.length} template caches`);
  }
};

const startNotificationJobs = () => {
  // Bulk promotion at 12pm and 8pm daily
  cron.schedule("0 12,20 * * *", async () => {
    console.log("📢 Queueing bulk promotional notifications...");
    await sendBulkPromotion();
  });

  console.log("✅ Notification jobs scheduled");
};

module.exports = {
  notifyUser,
  notifyMultipleUsers,
  sendOrderNotification,
  sendBulkPromotion,
  startNotificationJobs,
  invalidateTemplateCache,
  invalidateAllTemplateCache,
};
