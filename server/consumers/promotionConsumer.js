const { consume } = require("../utils/messageBroker");
const { notifyUser } = require("../utils/notificationService");

const start = async () => {
  await consume("promotion.send", async ({ userCIFId, templateKey }) => {
    await notifyUser(userCIFId, templateKey, {});
  });

  console.log("✅ Promotion consumer started");
};

module.exports = { start };
