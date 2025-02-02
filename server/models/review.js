module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      orderComment:{
        type : DataTypes.TEXT,
      },
      suggestion: {
        type: DataTypes.TEXT,
      },
      complaints: {
        type: DataTypes.TEXT,
      },
      reviewPostedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
  
    return Review;
  };
  