const {
  Order,
  OrderItem,
  MenuItem,
  Branch,
  Offer,
  OrderHistory,
} = require("../models");
const {
  generateTxnReferenceNumber,
  generateTrackingNumber,
} = require("../utils/orderHelpers");
const orderLogger = require("../utils/logger/ordersLogger");
const { publish } = require("../utils/messageBroker");
const { Op } = require("sequelize");

const validateMenuItems = async (items, BranchId) => {
  if (!items || items.length === 0)
    throw new Error("Items array cannot be empty");

  for (const item of items) {
    if (item.quantity <= 0)
      throw new Error(`Invalid quantity for MenuItem ID: ${item.MenuItemId}`);
  }

  const menuItemIds = items.map((i) => i.MenuItemId);
  const menuItems = await MenuItem.findAll({ where: { id: menuItemIds } });

  const invalid = [];
  menuItems.forEach((m) => {
    if (m.BranchId !== BranchId)
      invalid.push(`MenuItem ${m.id} doesn't belong to Branch ${BranchId}`);
  });
  if (invalid.length) throw new Error(invalid.join(", "));
  if (menuItems.length !== menuItemIds.length)
    throw new Error("Some MenuItem IDs are invalid");

  return menuItems;
};

// Calculate Estimated Preparation Time
const calculateEstimatedTime = async (items, deliveryDistance = 5) => {
  let totalPrepTime = 0;
  const bulkFactor = 6.32;
  const bulkThreshold = 2;
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

const calculatePricing = (menuItems, items, offer) => {
  const itemMap = new Map(menuItems.map((m) => [m.id, m]));
  const total = items.reduce(
    (sum, item) => sum + itemMap.get(item.MenuItemId).price * item.quantity,
    0,
  );

  let discountAmount = 0;
  if (offer) discountAmount = (offer.discount_percentage / 100) * total;

  return {
    original: total,
    discount: discountAmount,
    tax: 10.0,
    deliveryFee: 2.0,
    final: total - discountAmount + 10.0 + 2.0,
  };
};

exports.createOrder = async (user, body, performedBy, req) => {
  const {
    BranchId,
    items,
    offerId,
    paymentMethod,
    customerName,
    customerContact,
    customerAddress,
    notes,
    specialInstructions,
    deliveryDistance,
  } = body;

  const branch = await Branch.findByPk(BranchId);
  if (!branch) throw new Error("Invalid branch ID");

  if (!["cash", "card", "online"].includes(paymentMethod))
    throw new Error("Invalid payment method");

  const menuItems = await validateMenuItems(items, BranchId);

  let offer = null;
  if (offerId) {
    offer = await Offer.findByPk(offerId);
    if (!offer) throw new Error("Invalid offer ID");
    const now = new Date();
    if (now < offer.valid_from || now > offer.valid_to)
      throw new Error("Offer is not valid / expired");
    await offer.increment("redeemed_count");
  }

  const pricing = calculatePricing(menuItems, items, offer);
  const estimatedTimes = await calculateEstimatedTime(items, deliveryDistance);
  const itemMap = new Map(menuItems.map((m) => [m.id, m]));

  const order = await Order.create({
    UserId: user.id,
    BranchId,
    total_price: pricing.final,
    status: "pending",
    paymentMethod,
    discountAmount: pricing.discount,
    taxAmount: pricing.tax,
    estimatedDeliveryTime: estimatedTimes,
    TxnReferenceNumber: generateTxnReferenceNumber(),
    trackingNumber: generateTrackingNumber(),
    customerName,
    customerContact,
    customerAddress,
    notes,
    specialInstructions,
    redeemCodeUsed: offerId,
    orderBy: performedBy,
  });

  await OrderItem.bulkCreate(
    items.map((item) => ({
      OrderId: order.id,
      MenuItemId: item.MenuItemId,
      quantity: item.quantity,
      price: itemMap.get(item.MenuItemId).price,
    })),
  );

  const response = await buildResponse(
    order,
    branch,
    user,
    itemMap,
    items,
    pricing,
    estimatedTimes,
    performedBy,
    req,
  );

  await OrderHistory.create({
    orderId: order.id,
    userCIFId: performedBy,
    status: order.status,
    snapshot: response,
    recordedAt: new Date(),
  });

  orderLogger.info("Order created successfully", {
    orderId: order.id,
    performedBy,
  });
  publish("order.placed", {
    orderId: order.id,
    userCIFId: performedBy,
    status: "pending",
    snapshot: response,
  });
  return response;
};

// builds the same response shape your frontend expects — unchanged
const buildResponse = async (
  order,
  branch,
  user,
  itemMap,
  items,
  pricing,
  estimatedTimes,
  performedBy,
  req,
) => ({
  status: 200,
  success: true,
  title: "Order placed successfully",
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
    branchImage: branch.mainImage,
    branchAddress: branch.address,
  },
  userDetails: {
    userId: req.user.id,
    username: req.user.username,
    email: req.user.email,
    userImage: req.user.userImage,
    CifId: performedBy,
  },
  items: await Promise.all(
    items.map((item) => {
      const menuItem = itemMap.get(item.MenuItemId);
      return {
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        total: menuItem.price * item.quantity,
        menuImage: menuItem.menuImage,
      };
    }),
  ),
  paymentDetails: {
    paymentMethod: order.paymentMethod,
    paymentStatus: "unpaid",
    TxnReferenceNumber: order.TxnReferenceNumber,
    totalPrice: parseFloat(pricing.final.toFixed(2)),
    subtotal: parseFloat(pricing.original.toFixed(2)),
    discountAmount: parseFloat((order.discountAmount ?? 0).toFixed(2)),
    taxAmount: parseFloat((order.taxAmount ?? 0).toFixed(2)),
    deliveryFee: parseFloat(pricing.deliveryFee.toFixed(2)),
    total: parseFloat(pricing.original.toFixed(2)),
  },
});

exports.updateOrderStatus = async (id, action) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error("Order not found");

  if (action === "complete") {
    if (["completed", "delivered"].includes(order.status))
      throw new Error("This Order is Already delivered");
    if (order.status === "cancelled")
      throw new Error("This Order is Already Cancelled");

    order.status = "completed";
    order.paymentStatus = "paid";
    order.completedAt = new Date();
    await order.save();
    return { message: "Order status updated to completed successfully", order };
  }

  if (action === "cancel") {
    if (["delivered", "completed"].includes(order.status))
      throw new Error(
        "Cannot cancel an order that has already been delivered or completed",
      );
    if (order.status === "cancelled")
      throw new Error("Order already cancelled");

    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.paymentStatus = "cancelled";
    await order.save();
    return { message: "Order cancelled successfully", order };
  }

  throw new Error("Invalid action | Please select complete or cancel");
};
