const PDFDocument = require("pdfkit-table");
const moment = require("moment-timezone");
const { Order } = require("../models");
const { getOrderStatusReport } = require("../utils/orderHelpers");
const { Op } = require("sequelize");

const TIMEZONE = "Asia/Kolkata";

const formatDate = (date) =>
  moment(date).tz(TIMEZONE).format("D MMMM YYYY, h:mm A");

const getFilterCondition = (filterType) => {
  const config = {
    pending: {
      status: {
        [Op.in]: ["pending", "preparing", "on the way"],
      },
      label: "Expected Delivery At",
    },

    on_the_way: {
      status: "on the way",
      label: "Expected Delivery At",
    },

    completed: {
      status: "completed",
      label: "Completed At",
    },

    cancelled: {
      status: "cancelled",
      label: "Cancelled At",
    },

    not_delivered: {
      status: {
        [Op.ne]: "delivered",
        [Op.notIn]: ["cancelled", "completed"],
      },
      label: "Expected Delivery At",
    },

    delivered: {
      status: "delivered",
      label: "Delivered At",
    },

    all: {
      status: {
        [Op.not]: null,
      },
      label: "Delivered / Cancelled / Completed At",
    },
  };

  return (
    config[filterType] || {
      status: {
        [Op.not]: null,
      },
      label: "Delivered / Cancelled / Completed At",
    }
  );
};

const generatePDF = async (orders, filterType, label) => {
  const doc = new PDFDocument({
    margin: 20,
    size: "A4",
    layout: "landscape",
  });

  const buffers = [];

  doc.on("data", (chunk) => buffers.push(chunk));

  doc.fontSize(18).text(`Order Report (${filterType.replace("_", " ")})`, {
    align: "center",
  });

  doc.moveDown(2);

  const table = {
    headers: [
      {
        label: "Txn Ref No",
        property: "TxnReferenceNumber",
        width: 80,
        align: "center",
      },
      {
        label: "Price",
        property: "total_price",
        width: 70,
      },
      {
        label: "Status",
        property: "status",
        width: 80,
      },
      {
        label: "Payment Method",
        property: "paymentMethod",
        width: 80,
      },
      {
        label: "Payment Status",
        property: "paymentStatus",
        width: 80,
      },
      {
        label: "Current Status",
        property: "currentStatus",
        width: 120,
      },
      {
        label: "Next Stage",
        property: "nextStage",
        width: 120,
      },
      {
        label,
        property: "expectedDeliveryTime",
        width: 120,
      },
    ],

    datas: orders.map((order) => {
      const estimatedTime =
        typeof order.estimatedDeliveryTime === "string"
          ? JSON.parse(order.estimatedDeliveryTime)
          : order.estimatedDeliveryTime;

      const report = getOrderStatusReport(
        estimatedTime,
        order.createdAt,
        order.status,
        order.cancelledAt,
        order.completedAt,
      );

      let expectedDeliveryTime = report.expectedDeliveryTime;

      if (order.status === "cancelled") {
        expectedDeliveryTime = order.cancelledAt
          ? formatDate(order.cancelledAt)
          : "N/A";
      }

      if (order.status === "completed") {
        expectedDeliveryTime = order.completedAt
          ? formatDate(order.completedAt)
          : "N/A";
      }

      return {
        TxnReferenceNumber: order.TxnReferenceNumber,

        total_price: String(order.total_price),

        status: order.status,

        paymentMethod: order.paymentMethod,

        paymentStatus: order.paymentStatus,

        currentStatus: report.currentStatus,

        nextStage: report.nextStage,

        expectedDeliveryTime,
      };
    }),
  };

  await doc.table(table, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),

    prepareRow: () => doc.font("Helvetica").fontSize(10),

    columnSpacing: 5,
    width: 750,
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers).toString("base64"));
    });
  });
};

exports.generateStatusReport = async (startDate, endDate, filterType) => {
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required");
  }

  const start = moment(startDate).startOf("day").tz(TIMEZONE).format();

  const end = moment(endDate).endOf("day").tz(TIMEZONE).format();

  const filter = getFilterCondition(filterType);

  const orders = await Order.findAll({
    where: {
      orderDate: {
        [Op.between]: [start, end],
      },

      status: filter.status,
    },
  });

  if (!orders.length) {
    throw new Error(`No ${filterType} orders found`);
  }

  return generatePDF(orders, filterType, filter.label);
};
