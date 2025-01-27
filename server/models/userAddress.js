module.exports = (sequelize, DataTypes) => {
    const UserAddress = sequelize.define('UserAddress', {
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return UserAddress;
  };
  