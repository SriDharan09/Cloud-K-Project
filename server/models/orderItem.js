module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      scopes: {
        // Scope to include basic order item details
        basicInfo: {
          attributes: ["id", "quantity", "price"],
        },
        // Scope to include details along with the associated MenuItem
        withMenuItem: {
          attributes: ["id", "quantity", "price"],
          include: [
            {
              association: "MenuItem", // Ensure this is the name of the association
              attributes: ["id", "name", "price"],
            },
          ],
        },
      },
    }
  );

  return OrderItem;
};
