module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define(
      "Notification",
      {
        userCIFId: {
          type: DataTypes.STRING, // Changed from INTEGER to STRING
          allowNull: false,
          references: {
            model: "Users", // Ensure this matches the actual table name
            key: "userCIFId", // This should match the column in Users table
          },
          onDelete: "CASCADE",
        },
        type: {
          type: DataTypes.ENUM("profile_update", "promotion", "reminder", "order_status", "general"),
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        data: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        is_read: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        sent_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        scopes: {
          basicInfo: {
            attributes: ["id", "userCIFId", "type", "title", "message", "is_read", "sent_at"],
          },
        },
      }
    );
  
    return Notification;
  };
  