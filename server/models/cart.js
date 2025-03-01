module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define(
      "Cart",
      {
        userId: {
          type: DataTypes.STRING,
          allowNull: false
        },
        cartData: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {},
        },
      },
      {
        tableName: "carts",
        timestamps: true,
        scopes: {
          basicInfo: {
            attributes: ["id", "userId", "cartData"],
          },
        },
      }
    );
  
    return Cart;
  };
  