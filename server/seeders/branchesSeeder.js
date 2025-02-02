"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Branches",
      [
        {
          name: "VRS Foods",
          address: "Swamimalai, Kumbakonam",
          phone_number: "9811122334",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Murari Sweets and chats",
          address: "Kumbakonam, Thanjavur",
          phone_number: "9822334455",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "A2B",
          address: "M.G. Road, Bangalore",
          phone_number: "9833445566",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sangeetha's",
          address: "T. Nagar, Chennai",
          phone_number: "9844556677",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "KFC and Desserts",
          address: "Salt Lake road , kumbakonam",
          phone_number: "9855667788",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Branches", null, {});
  },
};
