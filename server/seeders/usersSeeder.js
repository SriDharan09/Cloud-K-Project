"use strict";
const bcrypt = require("bcryptjs");
const { Role } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPasswordAdmin = await bcrypt.hash("Admin@01", 10);
    const hashedPasswordUser = await bcrypt.hash("User@01", 10);

    await queryInterface.bulkInsert("Users", [
      {
        username: "sridhar",
        email: "sridharselvaraj07@gmail.com",
        password: hashedPasswordAdmin,
        userCIFId: "CIF12345",
        phoneNumber: "9876543210",
        address: JSON.stringify({
          street: "123 Main Street",
          city: "Chennai",
          state: "Tamil Nadu",
          zip: "600001",
        }),
        profilePictureUrl: null,
        isEmailVerified: true,
        isActive: true,
        lastLoginAt: new Date(),
        loginAttempts: 0,
        lastLoginAttempt: null,
        preferences: JSON.stringify({ theme: "dark", notifications: true }),
        resetToken: null,
        RoleId: 1,
        resetTokenExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "user",
        email: "user@gmail.com",
        password: hashedPasswordUser,
        userCIFId: "CIF67890",
        phoneNumber: "9876501234",
        address: JSON.stringify({
          street: "456 User Lane",
          city: "Bangalore",
          state: "Karnataka",
          zip: "560001",
        }),
        profilePictureUrl: null,
        isEmailVerified: true,
        isActive: true,
        lastLoginAt: new Date(),
        loginAttempts: 0,
        lastLoginAttempt: null,
        preferences: JSON.stringify({ theme: "light", notifications: false }),
        resetToken: null,
        resetTokenExpires: null,
        RoleId :2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", {
      email: ["sridharselvaraj07@gmail.com", "user@gmail.com"],
    });
  },
};
