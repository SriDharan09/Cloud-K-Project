const {
  Order,
  OrderItem,
  MenuItem,
  User,
  Branch,
  Offer,
} = require("../models");
const orderLogger = require("../utils/logger/ordersLogger");
const crypto = require("crypto");
const { formatOrderResponse } = require("../utils/orderFormatter");
const { log } = require("console");
const { Op } = require("sequelize");
const moment = require("moment-timezone");
const cron = require("node-cron");
const orderAttributes = [
  "id",
  "total_price",
  "status",
  "paymentMethod",
  "paymentStatus",
  "notes",
  "specialInstructions",
  "discountAmount",
  "taxAmount",
  "trackingNumber",
  "estimatedDeliveryTime",
  "createdAt",
  "updatedAt",
];

exports.createOrder = async (req, res) => {
  const performedBy = req.userCIFId;
  const requestInfo = { method: req.method, url: req.url, body: req.body };

  try {
    const { id: UserId } = req.user;
    const {
      BranchId,
      items,
      offerId,
      customerName,
      customerContact,
      customerAddress,
      notes,
      specialInstructions,
      paymentMethod,
      deliveryDistance,
    } = req.body;

    let discountedTotalPrice = 0;
    let totalQuantity = 0;

    // Validate Branch
    const branch = await Branch.findByPk(BranchId);
    if (!branch) {
      orderLogger.error("Invalid branch ID", { requestInfo, performedBy });
      return res.status(400).json({ error: "Invalid branch ID" });
    }

    // Validate Menu Items
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.MenuItemId);
      if (!menuItem) {
        orderLogger.error(`Invalid MenuItem ID: ${item.MenuItemId}`, {
          requestInfo,
          performedBy,
        });
        return res
          .status(400)
          .json({ error: `Invalid MenuItem ID: ${item.MenuItemId}` });
      }
    }

    if (items.length === 0) {
      orderLogger.error("Items array cannot be empty", {
        requestInfo,
        performedBy,
      });
      return res.status(400).json({ error: "Items array cannot be empty" });
    }

    // Validate Quantities
    for (const item of items) {
      if (item.quantity <= 0) {
        orderLogger.error(
          `Invalid quantity for MenuItem ID: ${item.MenuItemId}`,
          { requestInfo, performedBy }
        );
        return res.status(400).json({
          error: `Invalid quantity for MenuItem ID: ${item.MenuItemId}`,
        });
      }
    }

    // Validate Payment Method
    const validPaymentMethods = ["cash", "card", "online"];
    if (!validPaymentMethods.includes(paymentMethod)) {
      orderLogger.error("Invalid payment method", { requestInfo, performedBy });
      return res.status(400).json({ error: "Invalid payment method" });
    }

    // Calculate Prices
    let totalPriceWithoutDiscount = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.MenuItemId);
      if (menuItem) {
        totalPriceWithoutDiscount += menuItem.price * item.quantity;
      }
    }

    let originalPrice = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.MenuItemId);
      if (menuItem) {
        originalPrice += menuItem.price * item.quantity;
      }
    }

    // Apply Offer
    let discountAmount = 0;
    if (offerId) {
      const offer = await Offer.findByPk(offerId);
      if (!offer) {
        orderLogger.error("Invalid offer ID", { requestInfo, performedBy });
        return res.status(400).json({ error: "Invalid offer ID" });
      }

      const currentDate = new Date();
      if (currentDate < offer.valid_from || currentDate > offer.valid_to) {
        orderLogger.error("Offer is not valid / expired", {
          requestInfo,
          performedBy,
        });
        return res.status(400).json({ error: "Offer is not valid / expired" });
      }

      if (totalPriceWithoutDiscount < offer.min_order_amount) {
        orderLogger.error(
          "Order does not meet the minimum amount required for the offer",
          { requestInfo, performedBy }
        );
        return res.status(400).json({
          error:
            "Order does not meet the minimum amount required for the offer",
        });
      }

      discountAmount =
        (offer.discount_percentage / 100) * totalPriceWithoutDiscount;
    }

    discountedTotalPrice = totalPriceWithoutDiscount - discountAmount;

    const taxAmount = 10.0;
    const deliveryFee = 2.0;
    const finalTotalPrice = discountedTotalPrice + taxAmount + deliveryFee;

    // Calculate Estimated Preparation Time
    const calculateEstimatedTime = async (items, deliveryDistance = 5) => {
      let totalPrepTime = 0;
      const bulkFactor = 6.32;
      const bulkThreshold = 3;
      const deliveryBaseTime = 5; // Base delivery time in minutes
      const deliveryPerKm = 2; // Additional time per km

      // Fetch all MenuItem data in one query
      const menuItemIds = items.map((item) => item.MenuItemId);
      const menuItems = await MenuItem.findAll({ where: { id: menuItemIds } });

      // Create a map for MenuItem preparation times
      const prepTimeMap = new Map();
      menuItems.forEach((menuItem) => {
        prepTimeMap.set(menuItem.id, parseFloat(menuItem.preparationTime) || 0);
      });

      for (const item of items) {
        const { MenuItemId, quantity } = item;
        const prepTime = prepTimeMap.get(MenuItemId) || 0;

        if (quantity >= bulkThreshold) {
          totalPrepTime += (prepTime * quantity) / bulkFactor;
        } else {
          totalPrepTime += prepTime * quantity;
        }
      }

      // Round estimated preparation time
      const roundedPrepTime = Math.ceil(totalPrepTime);

      // Calculate estimated delivery time
      const estimatedDeliveryTime =
        deliveryBaseTime + deliveryDistance * deliveryPerKm;

      // Total estimated time (Preparation + Delivery)
      const totalEstimatedTime = roundedPrepTime + estimatedDeliveryTime;

      return {
        preparationTime: roundedPrepTime,
        deliveryTime: estimatedDeliveryTime,
        totalTime: totalEstimatedTime,
      };
    };

    // Calculate estimated time before creating order
    const estimatedTimes = await calculateEstimatedTime(
      items,
      deliveryDistance
    );
    console.log("DATAAAAAAAAAAAAAAAAAAAa" + estimatedTimes.totalTime);

    // Create Order
    const order = await Order.create({
      UserId,
      BranchId,
      total_price: finalTotalPrice,
      status: "pending",
      paymentMethod,
      discountAmount,
      taxAmount,
      estimatedDeliveryTime: estimatedTimes,
      TxnReferenceNumber: generateTxnReferenceNumber(),
      trackingNumber: generateTrackingNumber(),
      customerName,
      customerContact,
      customerAddress,
      notes,
      specialInstructions,
      orderBy: performedBy,
    });

    // Create Order Items
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.MenuItemId);
      if (menuItem) {
        await OrderItem.create({
          OrderId: order.id,
          MenuItemId: menuItem.id,
          quantity: item.quantity,
          price: menuItem.price,
        });
      }
    }

    const subtotalResponse = discountedTotalPrice;
    const totalPriceResponse = subtotalResponse + taxAmount + deliveryFee;

    // Log Order Creation Success
    orderLogger.info("Order created successfully", {
      orderId: order.id,
      totalPrice: finalTotalPrice,
      subtotal: subtotalResponse,
      discountAmount,
      taxAmount,
      deliveryFee,
      estimatedTimes,
      items,
      customerName,
      requestInfo,
      performedBy,
    });

    // Structured Response
    res.json({
      orderDetails: {
        orderId: order.id,
        orderDate: new Date(order.createdAt).toLocaleDateString("en-GB"),
        status: order.status,
        trackingNumber: order.trackingNumber,
        preparationTime: `${estimatedTimes.preparationTime} minutes`,
        notes: order.notes,
        specialInstructions: order.specialInstructions,
      },
      customerDetails: {
        name: order.customerName,
        contact: order.customerContact,
        address: order.customerAddress,
      },
      branchDetails: {
        branchId: branch.id,
        branchName: branch.name,
        branchAddress: branch.address,
      },
      userDetails: {
        userId: UserId,
        username: req.user.username,
        email: req.user.email,
        CifId: performedBy,
      },
      items: await Promise.all(
        items.map(async (item) => {
          const menuItem = await MenuItem.findByPk(item.MenuItemId);
          return {
            menuItemId: menuItem.id,
            name: menuItem.name,
            quantity: item.quantity,
            price: menuItem.price,
            total: menuItem.price * item.quantity,
          };
        })
      ),
      paymentDetails: {
        paymentMethod: order.paymentMethod,
        paymentStatus: "unpaid",
        TxnReferenceNumber: order.TxnReferenceNumber,
        totalPrice:
          totalPriceResponse !== undefined
            ? parseFloat(totalPriceResponse.toFixed(2))
            : 0.0,
        subtotal:
          subtotalResponse !== undefined
            ? parseFloat(subtotalResponse.toFixed(2))
            : 0.0,
        discountAmount:
          order.discountAmount !== undefined
            ? parseFloat(order.discountAmount.toFixed(2))
            : 0.0,
        taxAmount:
          order.taxAmount !== undefined
            ? parseFloat(order.taxAmount.toFixed(2))
            : 0.0,
        deliveryFee:
          deliveryFee !== undefined ? parseFloat(deliveryFee.toFixed(2)) : 0.0,
        total:
          originalPrice !== undefined
            ? parseFloat(originalPrice.toFixed(2))
            : 0.0,
      },
    });
  } catch (error) {
    orderLogger.error("Error creating order", { requestInfo, error });
    res.status(400).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count: totalOrders, rows: orders } = await Order.findAndCountAll({
      include: [
        { model: User.scope("profile") },
        { model: Branch.scope("basicInfo") },
        { model: OrderItem.scope("withMenuItem") },
      ],
      attributes: orderAttributes,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    console.log("Orders Data:", orders); // Debugging: Log the orders response
    const totalPages = Math.ceil(totalOrders / limit);
    const structuredOrders = formatOrderResponse(orders);

    res.json({
      totalOrders: orders.length,
      totalPages,
      currentPage: page,
      orders: structuredOrders,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User.scope("detailedInfo") },
        { model: Branch.scope("basicInfo") },
        { model: OrderItem.scope("withMenuItem") },
      ],
      attributes: orderAttributes,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ orders: formatOrderResponse([order]) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFilteredOrder = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const cifId = req.userCIFId;

    const { count: totalOrders, rows: orders } = await Order.findAndCountAll({
      include: [
        { model: User.scope("profile"), where: { userCIFId: cifId } },
        { model: Branch.scope("basicInfo") },
        { model: OrderItem.scope("withMenuItem") },
      ],
      attributes: orderAttributes,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(totalOrders / limit);
    const structuredOrders = formatOrderResponse(orders);
    res.json({
      totalOrders: orders.length,
      totalPages,
      currentPage: page,
      orders: structuredOrders,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getbyTxnData = async (req, res) => {
  try {
    const { TxnReferenceNumber } = req.body;
    const orders = await Order.findAll({
      where: {
        [Op.or]: [
          { TxnReferenceNumber: TxnReferenceNumber },
          { trackingNumber: TxnReferenceNumber },
        ],
      },
      include: [
        { model: User.scope("basicInfo") },
        { model: Branch.scope("basicInfo") },
        { model: OrderItem.scope("withMenuItem") },
      ],
    });

    if (!orders.length) {
      return res.status(404).json({
        error: "No orders found for the given transaction reference number.",
      });
    }
    const structuredOrders = formatOrderResponse(orders);
    const currentStatus = getOrderStatusReport(
      structuredOrders[0].orderDetails.estimatedDeliveryTime,
      structuredOrders[0].orderDetails.createdAt,
      structuredOrders[0].orderDetails.status
    );

    res.json({
      statusReport: currentStatus,
      orders: structuredOrders,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!action) {
      return res.status(400).json({ error: "Action is required" });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (action === "complete") {
      if (order.status === "completed") {
        return res
          .status(400)
          .json({ error: "This Order is Already delivered" });
      }
      if (order.status === "cancelled") {
        return res
          .status(400)
          .json({ error: "This Order is Already Cancelled" });
      }

      order.status = "completed";
      order.paymentStatus = "paid";
      order.completedAt = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss"); 
      await order.save();

      return res.json({
        message: "Order status updated to completed successfully",
        order,
      });
    }

    if (action === "cancel") {
      if (order.status === "delivered" || order.status === "completed") {
        return res.status(400).json({
          error:
            "Cannot cancel order that has already been delivered or completed",
        });
      }
      if (order.status === "cancelled") {
        return res.status(400).json({ error: "Order already cancelled" });
      }

      order.status = "cancelled";
      order.cancelledAt = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss"); 
      order.paymentStatus = "cancelled";
      await order.save();

      return res.json({ message: "Order cancelled successfully", order });
    }

    return res.status(400).json({ error: "Invalid action | Please select complete or cancel" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    await order.destroy();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Utility Functions
cron.schedule("* * * * *", () => {
  console.log("⏳ Running order status update...");
  updateOrderStatuses();
});
function formatDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);

  return `${day}${month}${year}`;
}
function generateTxnReferenceNumber() {
  const datePart = formatDate();
  const randomPart = crypto.randomBytes(4).toString("hex");
  return `TXN-${datePart}-${randomPart}`;
}
function generateTrackingNumber() {
  const datePart = formatDate();
  const randomPart = crypto.randomBytes(4).toString("hex");
  return `TRK-${datePart}-${randomPart}`;
}

const getOrderStatusReport = (estimatedDeliveryTime, createdAt,curStatus) => {
  if (!estimatedDeliveryTime || !createdAt) {
    return {
      currentStatus: "Unknown",
      nextStage: "N/A",
      expectedDeliveryTime: "N/A",
    };
  }
  if(curStatus === "cancelled" || curStatus === "completed"){
    return {
      currentStatus: curStatus,
      nextStage: "N/A",
      expectedDeliveryTime: "N/A",
    };
  }

  const { preparationTime, deliveryTime, totalTime } = estimatedDeliveryTime;

  const orderCreatedAt = moment(createdAt, "D/M/YYYY, h:mm:ss a", true).tz(
    "Asia/Kolkata"
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
    moment().tz("Asia/Kolkata").diff(orderCreatedAt, "minutes")
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
    currentStatus: `${status} (${formattedRemainingTime} remaining)`,
    nextStage,
    expectedDeliveryTime,
  };
};
const updateOrderStatuses = async () => {
  try {
    // Fetch all orders that are still active (not delivered or canceled)
    const orders = await Order.findAll({
      where: {
        status: { [Op.in]: ["pending", "preparing", "on the way"] },
      },
    });

    const currentTime = moment().tz("Asia/Kolkata");

    let updates = [];

    for (const order of orders) {
      let { estimatedDeliveryTime, createdAt, paymentStatus, status } = order;

      if (!estimatedDeliveryTime) continue;

      if (typeof estimatedDeliveryTime === "string") {
        try {
          estimatedDeliveryTime = JSON.parse(estimatedDeliveryTime);
        } catch (err) {
          console.error(
            `❌ Error parsing estimatedDeliveryTime for Order ${order.id}:`,
            err
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

      if (elapsedMinutes >= totalTime) {
        newStatus = "delivered";
        completedAt = currentTime.format("YYYY-MM-DD HH:mm:ss");
        if (paymentStatus === "unpaid") {
          newPaymentStatus = "paid"; // Update payment status if the order is delivered
        }
      } else if (elapsedMinutes >= preparationTime) {
        newStatus = "on the way";
      } else {
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
          { where: { id: update.id } }
        );
        console.log(
          `✅ Order ${update.id} updated to ${update.status}, Payment Status: ${update.paymentStatus}, Completed At: ${update.completedAt}`
        );
      }
    }
  } catch (error) {
    console.error("❌ Error updating order statuses:", error);
  }
};
