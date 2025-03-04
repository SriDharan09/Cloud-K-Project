module.exports = (sequelize, DataTypes) => {
  const OrderHistory = sequelize.define("OrderHistory", {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userCIFId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    snapshot: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    recordedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  OrderHistory.associate = (models) => {
    OrderHistory.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order",
    });
  };

  return OrderHistory;
};
