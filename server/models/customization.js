module.exports = (sequelize, DataTypes) => {
    const customization = sequelize.define('Customization', {
        minLength: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 8,
          validate: {
            min: 1, // Ensure minLength is a positive integer
          },
        },
        maxLength: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 20,
          validate: {
            min: 1, // Ensure maxLength is a positive integer
          },
        },
        minUpperCase: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          validate: {
            min: 0, // Allow zero if no uppercase is required
          },
        },
        minLowerCase: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          validate: {
            min: 0, // Allow zero if no lowercase is required
          },
        },
        minNumbers: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          validate: {
            min: 0, // Allow zero if no numbers are required
          },
        },
        minSpecialChars: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          validate: {
            min: 0, // Allow zero if no special characters are required
          },
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          onUpdate: DataTypes.NOW, 
        },
      },
    );
    
      return customization;
 }