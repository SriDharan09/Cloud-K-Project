module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('MenuItem', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM('AVAILABLE', 'SOLD_OUT', 'DISCONTINUED'),
      defaultValue: 'AVAILABLE',
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true, // Allow NULL values
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      defaultValue: 0.0,
    },
    preparationTime: {
      type: DataTypes.INTEGER,
    },
    isSpecial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    discountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
  });
  return MenuItem;
};
