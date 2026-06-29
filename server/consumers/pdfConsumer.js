const { consume } = require("../utils/messageBroker");
const pdfService = require("../services/pdfService");

const start = async () => {
  await consume("order.completed", async ({ orderId }) => {
    await pdfService.generateOrderReceipt(orderId);
    console.log(`📄 PDF generated for order ${orderId}`);
  });

  console.log("✅ PDF consumer started");
};

module.exports = { start };