'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert('Customizations', [
        {
          minLength: 4, // Ensure positive integer
          maxLength: 8, // Ensure positive integer and >= minLength
          minUpperCase: 1, // Allow zero or positive
          minLowerCase: 1, // Allow zero or positive
          minNumbers: 1, // Allow zero or positive
          minSpecialChars: 1, // Allow zero or positive
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});
    } catch (error) {
      console.error('Error during seeding:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Customizations', null, {});
  }
};
