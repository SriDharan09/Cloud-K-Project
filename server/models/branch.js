module.exports = (sequelize, DataTypes) => {
    const Branch = sequelize.define('Branch', {
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
    });
  
    return Branch;
  };
  
