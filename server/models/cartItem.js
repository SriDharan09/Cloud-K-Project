module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    "CartItem",
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      menuItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "menu_items", // actual table name
          key: "id",
        },
        onDelete: "CASCADE",
      },
      branchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Branches",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 1 },
      },
    },
    {
      tableName: "cart_items",
      timestamps: true,
      indexes: [
        {
          name: "cart_unique_item",
          unique: true,
          fields: ["userId", "branchId", "menuItemId"],
        },
      ],
    },
    {
      name: "cart_lookup_by_user",
      fields: ["userId"],
    },
  );

  return CartItem;
};
