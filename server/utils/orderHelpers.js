const crypto = require("crypto");
const moment = require("moment-timezone");

function formatDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
}

exports.generateTxnReferenceNumber = () =>
  `TXN-${formatDate()}-${crypto.randomBytes(4).toString("hex")}`;

exports.generateTrackingNumber = () =>
  `TRK-${formatDate()}-${crypto.randomBytes(4).toString("hex")}`;

exports.getOrderStatusReport = (
  estimatedDeliveryTime,
  createdAt,
  curStatus,
  cancelTime,
  completeTime,
) => {
  if (!estimatedDeliveryTime || !createdAt) {
    return {
      currentStatus: "Unknown",
      nextStage: "N/A",
      expectedDeliveryTime: "N/A",
    };
  }
  if (curStatus === "cancelled" || curStatus === "completed") {
    const formattedCancelTime = cancelTime
      ? moment(cancelTime, "D/M/YYYY, h:mm:ss a", true)
          .tz("Asia/Kolkata")
          .format("D MMMM YYYY, h:mm A")
      : "N/A";
    const formattedCompleteTime = completeTime
      ? moment(completeTime, "D/M/YYYY, h:mm:ss a", true)
          .tz("Asia/Kolkata")
          .format("D MMMM YYYY, h:mm A")
      : "N/A";
    if (curStatus.includes("cancel")) {
      return {
        currentStatus: curStatus,
        nextStage: "N/A",
        cancelledAt: formattedCancelTime,
      };
    } else if (curStatus.includes("complete")) {
      return {
        currentStatus: curStatus,
        nextStage: "N/A",
        completedAt: formattedCompleteTime,
      };
    }
  }

  const { preparationTime, deliveryTime, totalTime } = estimatedDeliveryTime;

  const orderCreatedAt = moment(createdAt, "D/M/YYYY, h:mm:ss a", true).tz(
    "Asia/Kolkata",
  );

  if (!orderCreatedAt.isValid()) {
    console.error("❌ Invalid createdAt date:", createdAt);
    return {
      currentStatus: "Unknown",
      nextStage: "N/A",
      expectedDeliveryTime: "N/A",
    };
  }

  // Calculate elapsed time in minutes
  const elapsedMinutes = Math.floor(
    moment().tz("Asia/Kolkata").diff(orderCreatedAt, "minutes"),
  );

  let status = "Delivered";
  let nextStage = "Order already delivered";
  let remainingTime = 0;

  if (elapsedMinutes < preparationTime) {
    status = "Preparing";
    remainingTime = preparationTime - elapsedMinutes;
    nextStage = "Out for delivery soon";
  } else if (elapsedMinutes < totalTime) {
    status = "On the way";
    remainingTime = totalTime - elapsedMinutes;
    nextStage = "Will be delivered soon";
  }

  // Calculate expected delivery time
  const expectedDeliveryTime = orderCreatedAt
    .add(totalTime, "minutes")
    .format("h:mm A");

  // Format remaining time
  const formattedRemainingTime =
    remainingTime > 60
      ? `${Math.floor(remainingTime / 60)} hr ${remainingTime % 60} min`
      : `${remainingTime} min`;

  return {
    currentStatus:
      formattedRemainingTime === "0 min"
        ? status
        : `${status} (${formattedRemainingTime} remaining)`,
    nextStage,
    expectedDeliveryTime,
  };
};
