module.exports = (sequelize, DataTypes) => {
    const DeliveryPersonnel = sequelize.define('DeliveryPersonnel', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM('available', 'unavailable'),
        defaultValue: 'available',
      },
    });
  
    return DeliveryPersonnel;
  };
  