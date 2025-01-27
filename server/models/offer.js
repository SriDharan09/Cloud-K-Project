module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define('Offer', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    discount_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    valid_from: {
      type: DataTypes.DATE,
    },
    valid_to: {
      type: DataTypes.DATE,
    },
    min_order_amount: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false,
    },
  });

  return Offer;
};
