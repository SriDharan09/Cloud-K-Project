const { Category } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Category;
};
