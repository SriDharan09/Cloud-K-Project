const orderService = require("../services/orderService");
const pdfService = require("../services/pdfService");
const { formatOrderResponse } = require("../utils/orderFormatter");
const { getOrderStatusReport } = require("../utils/orderHelpers");
const {
  Order,
  User,
  Branch,
  OrderItem,
  MenuItem,
  Review,
} = require("../models");
const { Op } = require("sequelize");
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
  try {
    const result = await orderService.createOrder(
      req.user,
      req.body,
      req.userCIFId,
      req,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const result = await orderService.updateOrderStatus(
      req.params.id,
      req.body.action,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.statusReportPDF = async (req, res) => {
  try {
    const { startDate, endDate, filterType } = req.query;
    if (!startDate || !endDate)
      return res
        .status(400)
        .json({ error: "Start date and end date are required." });

    const base64 = await pdfService.generateStatusReport(
      startDate,
      endDate,
      filterType,
    );
    res.json({ base64 });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
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
      structuredOrders[0].orderDetails.status,
      structuredOrders[0].orderDetails.cancelledAt,
      structuredOrders[0].orderDetails.completedAt,
    );

    res.json({
      statusReport: currentStatus,
      orders: structuredOrders,
    });
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

exports.rateFood = async (req, res) => {
  try {
    const userCifId = req.user.userCIFId;
    const {
      orderId,
      overallRating,
      ratings,
      WholeRating,
      comment,
      orderComment,
      suggestion,
      complaints,
    } = req.body;

    const orderItems = await OrderItem.findAll({
      where: { OrderId: orderId },
      include: [{ model: MenuItem, attributes: ["id", "name"] }],
    });

    if (!orderItems.length) {
      return res.status(404).json({ error: "Order not found or has no items" });
    }

    const order = await Order.findByPk(orderId);
    if (
      !order ||
      (order.status !== "delivered" && order.status !== "completed")
    ) {
      return res.status(400).json({
        error: "Reviews can only be added for delivered or completed orders",
      });
    }

    if (order.orderBy !== userCifId) {
      return res
        .status(403)
        .json({ error: "You can only review orders placed by you" });
    }
    const existingReview = await Review.findOne({
      where: { orderId, reviewPostedBy: userCifId },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this order" });
    }

    if (WholeRating) {
      if (overallRating) {
        if (overallRating < 1 || overallRating > 5) {
          return res
            .status(400)
            .json({ error: "Overall rating must be between 1 and 5." });
        }

        for (const item of orderItems) {
          const existingReview = await Review.findOne({
            where: {
              orderId,
              MenuItemId: item.MenuItemId,
              reviewPostedBy: userCifId,
            },
          });

          if (!existingReview) {
            await Review.create({
              rating: overallRating,
              orderId,
              comment,
              orderComment,
              suggestion,
              complaints,
              MenuItemId: item.MenuItemId,
              reviewPostedBy: userCifId,
            });

            await updateMenuItemRating(item.MenuItemId);
          }
        }

        return res.json({
          message: "All menu items have been rated with the overall rating.",
        });
      } else {
        return res
          .status(400)
          .json({ error: "Overall rating must be provided." });
      }
    }

    if (ratings && Array.isArray(ratings)) {
      const mismatchedItems = [];
      const orderedMenuItems = orderItems.map((item) => item.MenuItemId);

      for (let i = 0; i < ratings.length; i++) {
        const { MenuItemId, rating, comment, suggestion, complaints } =
          ratings[i];
        const orderItem = orderItems.find(
          (item) => item.MenuItemId === MenuItemId,
        );
        if (!orderItem) {
          mismatchedItems.push(MenuItemId);
          continue;
        }

        const existingReview = await Review.findOne({
          where: { orderId, MenuItemId, reviewPostedBy: userCifId },
        });

        if (existingReview) {
          await existingReview.update({
            rating,
            comment,
            suggestion,
            complaints,
          });
        } else {
          // If no review exists, create a new review
          await Review.create({
            rating,
            comment,
            suggestion,
            complaints,
            orderId,
            orderComment,
            MenuItemId,
            reviewPostedBy: userCifId,
          });
        }

        // Update the menu item rating after review
        await updateMenuItemRating(MenuItemId);
      }

      // If there are any mismatched items, return an error with details
      if (mismatchedItems.length > 0) {
        return res.status(400).json({
          error: `Oops! It seems the following menu items are not part of the order: ${mismatchedItems.join(
            ", ",
          )}. Please check your order and try again.`,
          details: {
            orderId: orderId,
            mismatchedMenuItems: mismatchedItems,
            message:
              "The menu items you attempted to rate are not included in this order. Please verify your order and try again with the correct items.",
            orderedMenuItems: orderedMenuItems,
          },
        });
      }

      return res.json({
        message: "Ratings for menu items have been updated successfully.",
      });
    }

    return res.status(400).json({ error: "No rating data provided." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Function to update the MenuItem rating based on reviews
const updateMenuItemRating = async (MenuItemId) => {
  const allReviews = await Review.findAll({
    where: { MenuItemId },
  });

  if (allReviews.length > 0) {
    const averageRating =
      allReviews.reduce((acc, review) => acc + review.rating, 0) /
      allReviews.length;

    const menuItem = await MenuItem.findByPk(MenuItemId);
    menuItem.rating = averageRating;
    await menuItem.save();
  }
};

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
