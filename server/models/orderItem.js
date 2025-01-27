module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  
    return OrderItem;
  };
  