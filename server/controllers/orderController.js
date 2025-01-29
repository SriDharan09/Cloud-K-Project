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

// Function to calculate estimated preparation time
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
    const calculateEstimatedTime = async (items) => {
      let totalTime = 0;
      const bulkFactor = 0.75;
      const timeMap = new Map();

      for (const item of items) {
        const { MenuItemId, quantity } = item;
        const menuItem = await MenuItem.findByPk(MenuItemId);

        if (menuItem) {
          const prepTime = parseFloat(menuItem.preparationTime);

          if (timeMap.has(MenuItemId)) {
            const count = timeMap.get(MenuItemId).count + quantity;
            const time = prepTime + (quantity - 1) * prepTime * bulkFactor;
            timeMap.set(MenuItemId, { time, count });
          } else {
            timeMap.set(MenuItemId, { time: prepTime, count: quantity });
          }
        }
      }

      timeMap.forEach((value) => {
        totalTime += value.time;
      });

      return Math.ceil(totalTime);
    };

    const estimatedPreparationTime = await calculateEstimatedTime(items);

    // Create Order
    const order = await Order.create({
      UserId,
      BranchId,
      total_price: finalTotalPrice,
      status: "pending",
      paymentMethod,
      discountAmount,
      taxAmount,
      estimatedPreparationTime: estimatedPreparationTime.customerName,
      TxnReferenceNumber: generateTxnReferenceNumber(),
      trackingNumber: generateTrackingNumber(),
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
      estimatedPreparationTime,
      items,
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
        preparationTime: `${estimatedPreparationTime} minutes`,
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

    // const { count: totalOrders, rows: orders } = await Order.findAndCountAll({
    //   include: [
    //     {
    //       model: User,
    //       attributes: ["id", "username", "email"], // Only include necessary fields
    //     },
    //     {
    //       model: Branch,
    //       attributes: ["id", "name", "address", "phone_number"], // Only include necessary fields
    //     },
    //     {
    //       model: OrderItem,
    //       include: [
    //         {
    //           model: MenuItem,
    //           attributes: ["id", "name", "price"], // Only include necessary fields
    //         },
    //       ],
    //       attributes: ["id", "quantity", "price"], // Only include necessary fields
    //     },
    //   ],
    //   attributes: [
    //     "id",
    //     "total_price",
    //     "status",
    //     "paymentMethod",
    //     "paymentStatus",
    //     "notes",
    //     "specialInstructions",
    //     "discountAmount",
    //     "taxAmount",
    //     "trackingNumber",
    //     "estimatedDeliveryTime",
    //     "createdAt",
    //     "updatedAt", // Only include necessary fields
    //   ],
    //   limit,
    //   offset,
    //   order: [["createdAt", "DESC"]], // Optional: to sort by creation date
    // });
    const { count: totalOrders, rows: orders } = await Order.findAndCountAll({
      include: [
        {
          model: User.scope("profile"), // Apply the 'basicInfo' scope to the User model
        },
        {
          model: Branch.scope("basicInfo"), // Apply the 'basicInfo' scope to the Branch model
        },
        {
          model: OrderItem.scope("withMenuItem"), // Apply the 'withMenuItem' scope to the OrderItem model
        },
      ],
      attributes: orderAttributes,
      limit,
      offset,
      order: [["createdAt", "DESC"]], // Optional: to sort by creation date
    });

    const totalPages = Math.ceil(totalOrders / limit);

    // Structure the response data
    const structuredOrders = orders.map((order) => ({
      orderDetails: {
        id: order.id,
        total_price: parseFloat(order.total_price).toFixed(2),
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        notes: order.notes,
        specialInstructions: order.specialInstructions,
        discountAmount: parseFloat(order.discountAmount).toFixed(2),
        taxAmount: parseFloat(order.taxAmount).toFixed(2),
        trackingNumber: order.trackingNumber,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        createdAt: new Date(order.createdAt).toLocaleString(),
        updatedAt: new Date(order.updatedAt).toLocaleString(),
      },
      customerDetails: {
        id: order.User?.id || null,
        username: order.User?.username || null,
        email: order.User?.email || null,
      },
      branchDetails: {
        id: order.Branch?.id || null,
        name: order.Branch?.name || null,
        address: order.Branch?.address || null,
        phoneNumber: order.Branch?.phone_number || null,
      },
      items: order.OrderItems.map((item) => ({
        id: item.id,
        name: item.MenuItem?.name || null,
        quantity: item.quantity,
        price: parseFloat(item.price).toFixed(2),
        total: (item.quantity * parseFloat(item.price)).toFixed(2),
      })),
    }));

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
    // const order = await Order.findByPk(req.params.id, {
    //   include: [
    //     {
    //       model: User,
    //       attributes: ["id", "username", "email"], // Only include necessary fields
    //     },
    //     {
    //       model: Branch,
    //       attributes: ["id", "name", "address", "phone_number"], // Only include necessary fields
    //     },
    //     {
    //       model: OrderItem,
    //       include: [
    //         {
    //           model: MenuItem,
    //           attributes: ["id", "name", "price"], // Only include necessary fields
    //         },
    //       ],
    //       attributes: ["id", "quantity", "price"], // Only include necessary fields
    //     },
    //   ],
    //   attributes: [
    //     "id",
    //     "total_price",
    //     "status",
    //     "paymentMethod",
    //     "paymentStatus",
    //     "notes",
    //     "specialInstructions",
    //     "discountAmount",
    //     "taxAmount",
    //     "trackingNumber",
    //     "estimatedDeliveryTime",
    //     "createdAt",
    //     "updatedAt", // Only include necessary fields
    //   ],
    //   raw: false,
    //   plain: true,
    // });
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User.scope("basicInfo"), // Apply the 'basicInfo' scope for User
        },
        {
          model: Branch.scope("basicInfo"), // Apply the 'basicInfo' scope for Branch
        },
        {
          model: OrderItem.scope("withMenuItem"), // Apply the 'withMenuItem' scope for OrderItem
        },
      ],
      attributes: orderAttributes,
      raw: false,
      plain: true,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Extract order details
    const orderDetails = {
      id: order.id,
      total_price: parseFloat(order.total_price).toFixed(2),
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      notes: order.notes,
      specialInstructions: order.specialInstructions,
      discountAmount: parseFloat(order.discountAmount).toFixed(2),
      taxAmount: parseFloat(order.taxAmount).toFixed(2),
      trackingNumber: order.trackingNumber,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      createdAt: new Date(order.createdAt).toLocaleString(),
      updatedAt: new Date(order.updatedAt).toLocaleString(),
    };

    // Extract customer details
    const customerDetails = {
      id: order.User.id,
      username: order.User.username,
      email: order.User.email, // Adjust based on what's appropriate to include
    };

    // Extract branch details
    const branchDetails = {
      id: order.Branch.id,
      name: order.Branch.name,
      address: order.Branch.address,
      phoneNumber: order.Branch.phone_number,
    };

    // Extract order items
    const items = order.OrderItems.map((item) => ({
      id: item.id,
      name: item.MenuItem.name,
      quantity: item.quantity,
      price: parseFloat(item.price).toFixed(2),
      total: (item.quantity * parseFloat(item.price)).toFixed(2),
    }));

    // Send the structured response
    res.json({
      orderDetails,
      customerDetails,
      branchDetails,
      items,
    });
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

    // const { count: totalOrders, rows: orders } = await Order.findAndCountAll({
    //   include: [
    //     {
    //       model: User,
    //       where: { userCIFId: cifId }, // Filter by CIF ID
    //       attributes: ["id", "username", "email"], // Only include necessary fields
    //     },
    //     {
    //       model: Branch,
    //       attributes: ["id", "name", "address", "phone_number"], // Only include necessary fields
    //     },
    //     {
    //       model: OrderItem,
    //       include: [
    //         {
    //           model: MenuItem,
    //           attributes: ["id", "name", "price"], // Only include necessary fields
    //         },
    //       ],
    //       attributes: ["id", "quantity", "price"], // Only include necessary fields
    //     },
    //   ],
    //   attributes: [
    //     "id",
    //     "total_price",
    //     "status",
    //     "paymentMethod",
    //     "paymentStatus",
    //     "notes",
    //     "specialInstructions",
    //     "discountAmount",
    //     "taxAmount",
    //     "trackingNumber",
    //     "estimatedDeliveryTime",
    //     "createdAt",
    //     "updatedAt", // Only include necessary fields
    //   ],
    //   limit,
    //   offset,
    //   order: [["createdAt", "DESC"]],
    // });

    const { count: totalOrders, rows: orders } = await Order.findAndCountAll({
      include: [
        {
          model: User.scope("profile"), // Apply the 'basicInfo' scope for User
          where: { userCIFId: cifId }, // Filter by CIF ID
        },
        {
          model: Branch.scope("basicInfo"), // Apply the 'basicInfo' scope for Branch
        },
        {
          model: OrderItem.scope("withMenuItem"), // Apply the 'withMenuItem' scope for OrderItem
        },
      ],
      attributes: orderAttributes,
      limit,
      offset,
      order: [["createdAt", "DESC"]], // Sort by creation date in descending order
    });

    const totalPages = Math.ceil(totalOrders / limit);

    // Structure the response data
    const structuredOrders = orders.map((order) => ({
      orderDetails: {
        id: order.id,
        total_price: parseFloat(order.total_price).toFixed(2),
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        notes: order.notes,
        specialInstructions: order.specialInstructions,
        discountAmount: parseFloat(order.discountAmount).toFixed(2),
        taxAmount: parseFloat(order.taxAmount).toFixed(2),
        trackingNumber: order.trackingNumber,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        createdAt: new Date(order.createdAt).toLocaleString(),
        updatedAt: new Date(order.updatedAt).toLocaleString(),
      },
      customerDetails: order.User,
      branchDetails: order.Branch,
      items: order.OrderItems.map((item) => ({
        id: item.id,
        name: item.MenuItem?.name || null,
        quantity: item.quantity,
        price: parseFloat(item.price).toFixed(2),
        total: (item.quantity * parseFloat(item.price)).toFixed(2),
      })),
    }));

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
    const cifId = req.userCIFId;
    const { TxnReferenceNumber } = req.body;

    // const orders = await Order.findAll({
    //   where: {
    //     TxnReferenceNumber: TxnReferenceNumber,
    //   },
    //   include: [
    //     {
    //       model: User,
    //       attributes: ["id", "username", "email"], // Only include necessary fields
    //     },
    //     {
    //       model: Branch,
    //       attributes: ["id", "name", "address", "phone_number"], // Only include necessary fields
    //     },
    //     {
    //       model: OrderItem,
    //       include: [
    //         {
    //           model: MenuItem,
    //           attributes: ["id", "name", "price"], // Only include necessary fields
    //         },
    //       ],
    //       attributes: ["id", "quantity", "price"], // Only include necessary fields
    //     },
    //   ],
    // });
    const orders = await Order.findAll({
      where: { TxnReferenceNumber },
      include: [
        {
          model: User.scope("basicInfo"),
        },
        {
          model: Branch.scope("basicInfo"),
        },
        {
          model: OrderItem.scope("withMenuItem"),
        },
      ],
    });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Allow status update only if current status is 'pending'
    if (order.status === "completed") {
      return res.status(400).json({ error: "This Order is Already delivered" });
    }
    if (order.status === "cancelled") {
      return res.status(400).json({ error: "This Order is Already Cancelled" });
    }

    // Update order status to 'completed'
    order.status = "completed";
    await order.save();

    res.json({
      message: "Order status updated to completed successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the order is cancellable (e.g., not already delivered or completed)
    if (order.status === "delivered" || order.status === "completed") {
      return res.status(400).json({
        error:
          "Cannot cancel order that has already been delivered or completed",
      });
    }
    if (order.status === "cancelled") {
      return res.status(400).json({ error: "Order already cancelled" });
    }

    // Update order status to cancelled
    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
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
