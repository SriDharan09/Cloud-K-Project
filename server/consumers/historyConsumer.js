const { consume } = require("../utils/messageBroker");
const { OrderHistory } = require("../models");

const start = async () => {
  await consume("order.placed", async ({ orderId, userCIFId, status, snapshot }) => {
    await OrderHistory.create({ orderId, userCIFId, status, snapshot, recordedAt: new Date() });
  });

  await consume("order.status_changed", async ({ orderId, status, snapshot }) => {
    await OrderHistory.update({ status, snapshot }, { where: { orderId } });
  });

  console.log("✅ History consumer started");
};

module.exports = { start };