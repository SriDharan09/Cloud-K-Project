'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', [
      { name: 'North Indian Cusine', createdAt: new Date(), updatedAt: new Date() },
      { name: 'South Indian Cusine', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Street Food', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Biryani', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Chinese', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sweets & Desserts', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fast Food', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
