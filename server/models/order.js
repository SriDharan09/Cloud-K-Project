module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    TxnReferenceNumber :{
      type:DataTypes.STRING,
      allowNull: true,
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'card', 'online'),
      defaultValue: 'cash',
    },
    paymentStatus: {
      type: DataTypes.ENUM('paid', 'unpaid', 'refunded'),
      defaultValue: 'unpaid',
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estimatedDeliveryTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
  };

  return Order;
};
