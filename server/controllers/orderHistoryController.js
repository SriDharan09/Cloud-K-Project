const { OrderHistory } = require("../models");

const getOrderHistory = async (req, res) => {
  try {
    const performedBy = req.userCIFId;

    const orderHistory = await OrderHistory.findAll({
      where: { userCIFId: performedBy },
      order: [["recordedAt", "DESC"]],
    });

    if (!orderHistory.length) {
      return res.status(404).json({
        success: false,
        message: "No order history found for this user.",
      });
    }

    res.json({
      success: true,
      history: orderHistory,
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { getOrderHistory };
