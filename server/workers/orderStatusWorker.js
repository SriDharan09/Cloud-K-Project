const cron = require("node-cron");
const moment = require("moment-timezone");
const { Order, OrderHistory } = require("../models");
const { notifyUser } = require("../utils/notificationService");
const { Op } = require("sequelize");

const updateOrderStatuses = async () => {
  try {
    const orders = await Order.findAll({
      where: {
        status: { [Op.in]: ["pending", "preparing", "on the way"] },
      },
    });

    const currentTime = moment().tz("Asia/Kolkata");

    let updates = [];

    for (const order of orders) {
      let { estimatedDeliveryTime, createdAt, paymentStatus, status, orderBy } =
        order;

      if (!estimatedDeliveryTime) continue;

      if (typeof estimatedDeliveryTime === "string") {
        try {
          estimatedDeliveryTime = JSON.parse(estimatedDeliveryTime);
        } catch (err) {
          console.error(
            `❌ Error parsing estimatedDeliveryTime for Order ${order.id}:`,
            err,
          );
          continue;
        }
      }

      const { preparationTime, totalTime } = estimatedDeliveryTime;
      const orderCreatedTime = moment(createdAt).tz("Asia/Kolkata");
      const elapsedMinutes = currentTime.diff(orderCreatedTime, "minutes");

      let newStatus = status;
      let newPaymentStatus = paymentStatus;
      let completedAt = null;
      let notificationKey = null;

      if (elapsedMinutes >= totalTime) {
        newStatus = "delivered";
        completedAt = currentTime.format("YYYY-MM-DD HH:mm:ss");
        if (paymentStatus === "unpaid") {
          newPaymentStatus = "paid";
        }
        notificationKey = "orderDelivered";
      } else if (elapsedMinutes >= preparationTime) {
        notificationKey = "orderOnTheWay";
        newStatus = "on the way";
      } else {
        notificationKey = "orderPreparing";
        newStatus = "preparing";
      }

      if (
        newStatus !== status ||
        newPaymentStatus !== paymentStatus ||
        completedAt
      ) {
        updates.push({
          id: order.id,
          status: newStatus,
          paymentStatus: newPaymentStatus,
          completedAt: completedAt,
          orderBy,
          notificationKey,
        });
      }
    }

    if (updates.length > 0) {
      for (const update of updates) {
        await Order.update(
          {
            status: update.status,
            paymentStatus: update.paymentStatus,
            completedAt: update.completedAt,
          },
          { where: { id: update.id } },
        );
        console.log(
          `✅ Order ${update.id} updated to ${update.status}, Payment Status: ${update.paymentStatus}, Completed At: ${update.completedAt}`,
        );
        const orderHistory = await OrderHistory.findOne({
          where: { orderId: update.id },
        });

        if (orderHistory) {
          let snapshot = orderHistory.snapshot;

          // ✅ Ensure snapshot is a valid JSON object
          if (typeof snapshot === "string") {
            try {
              snapshot = JSON.parse(snapshot);
            } catch (err) {
              console.error(
                `❌ Error parsing snapshot for OrderHistory ${orderHistory.id}:`,
                err,
              );
              continue; // Skip this order if snapshot is corrupted
            }
          }

          if (typeof snapshot !== "object" || snapshot === null) {
            console.error(
              `❌ Invalid snapshot format for OrderHistory ${orderHistory.id}, skipping update.`,
            );
            continue;
          }

          // ✅ Update only status & paymentStatus inside snapshot
          if (snapshot.orderDetails)
            snapshot.orderDetails.status = update.status;
          if (snapshot.paymentDetails)
            snapshot.paymentDetails.paymentStatus = update.paymentStatus;

          // ✅ Update orderHistory with new status & modified snapshot
          await OrderHistory.update(
            {
              status: update.status,
              snapshot: snapshot,
            },
            { where: { orderId: update.id } },
          );

          console.log(
            `📌 Order History Updated | Order: ${update.id} | Status: ${update.status}`,
          );
        }
        if (update.notificationKey) {
          console.log(update);
          await notifyUser(update.orderBy, update.notificationKey, {
            orderId: update.id,
            status: update.status,
          });
          console.log(
            `📩 Notification Sent to ${update.orderBy} | Order: ${update.id} | Type: ${update.notificationKey}`,
          );
        }
      }
    }
  } catch (error) {
    console.error("❌ Error updating order statuses:", error);
  }
};

// Cron runs here — not inside orderController
const start = () => {
  cron.schedule("* * * * *", () => {
    console.log("⏳ Running order status update...");
    updateOrderStatuses();
  });
  console.log("✅ Order status worker started");
};

module.exports = { start };
