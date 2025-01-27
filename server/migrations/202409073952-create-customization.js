'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Customizations', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      minLength: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 8,
      },
      maxLength: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 20,
      },
      minUpperCase: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      minLowerCase: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      minNumbers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      minSpecialChars: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Customizations');
  }
};
