module.exports = (sequelize, DataTypes) => {
  const NotificationTemplate = sequelize.define(
    "NotificationTemplate",
    {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: DataTypes.ENUM(
          "profile_update",
          "promotion",
          "reminder",
          "order_status",
          "general"
        ),
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
    },
    {
      tableName: "NotificationTemplates",
      timestamps: false,
    }
  );

  return NotificationTemplate;
};
