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
        allowNull: false, // e.g., 'CREATE', 'UPDATE', 'DELETE'
      },
      oldValues: {
        type: DataTypes.JSON,
        allowNull: true, // Stores the previous state of the record before the update
      },
      newValues: {
        type: DataTypes.JSON,
        allowNull: true, // Stores the new state of the record after the update
      },
      changes: {
        type: DataTypes.JSON,
        allowNull: true, // Specific changes made during the update
      },
      performedBy: {
        type: DataTypes.STRING,
        allowNull: true, // The user who performed the action
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true, // Additional notes or context about the operation
      },
    });
  
    return AuditLog;
  };
  