module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userCIFId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      profilePictureUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      loginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      lastLoginAttempt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      preferences: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
      resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetTokenExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      scopes: {
        // Default scope: restrict sensitive fields like password
        detailedInfo: {
          attributes: [
            "id",
            "username",
            "email",
            "phoneNumber",
            "address",
            "preferences",
            "createdAt",
            "updatedAt",
          ],
        },
        // Scope to include only basic user information
        basicInfo: {
          attributes: ["id", "username", "email"],
        },
        // Scope to include profile-related fields
        profile: {
          attributes: [
            "id",
            "username",
            "email",
            "profilePictureUrl",
            "phoneNumber",
          ],
        },
        // Scope for login attempts and verification
        loginInfo: {
          attributes: [
            "id",
            "username",
            "email",
            "isEmailVerified",
            "loginAttempts",
            "lastLoginAt",
          ],
        },
      },
    }
  );

  return User;
};
