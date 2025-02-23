module.exports = (sequelize, DataTypes) => {
    const AuditLog = sequelize.define('AuditLog', {
      tableName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      oldValues: {
        type: DataTypes.JSON,
        allowNull: true, 
      },
      newValues: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      changes: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      performedBy: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });
  
    return AuditLog;
  };
  