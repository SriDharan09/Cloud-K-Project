module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define("MenuItem", {
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
      type: DataTypes.ENUM("AVAILABLE", "SOLD_OUT", "DISCONTINUED"),
      defaultValue: "AVAILABLE",
    },
    menuImage: {
      type: DataTypes.STRING,
      allowNull: true,
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
    category: {
      type: DataTypes.STRING, // Category of the menu item (e.g., appetizers, main course)
      allowNull: false,
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nutritionalInfo: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isVeg: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    spicinessLevel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    servingSize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    menuPosition: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return MenuItem;
};
