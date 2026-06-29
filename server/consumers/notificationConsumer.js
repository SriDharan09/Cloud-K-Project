const { consume } = require("../utils/messageBroker");
const { notifyUser } = require("../utils/notificationService");

const start = async () => {
  await consume(
    "order.placed",
    async ({ userCIFId, orderId, status, notificationKey }) => {
      await notifyUser(userCIFId, notificationKey, { orderId, status });
    },
  );

  console.log("✅ Notification consumer started");
};

module.exports = { start };
