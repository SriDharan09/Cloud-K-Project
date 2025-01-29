module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define(
    "Branch",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
      },
    },
    {
      scopes: {
        // Scope to include basic branch details
        basicInfo: {
          attributes: ["id", "name", "address", "phone_number"],
        },
      },
    }
  );

  return Branch;
};
