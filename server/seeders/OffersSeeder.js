'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Offers', [
      {
        name: 'New Year Special',
        description: 'Get 20% off on all orders above ₹500!',
        discount_percentage: 20.00,
        valid_from: new Date('2025-01-01'),
        valid_to: new Date('2025-03-10'),
        min_order_amount: 500.00,
        redeemable: false,
        redeem_limit: 5,
        redeemed_count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Weekend Saver',
        description: 'Flat 50% off on orders above ₹1000!',
        discount_percentage: 50.00,
        valid_from: new Date('2025-02-01'),
        valid_to: new Date('2025-02-28'),
        min_order_amount: 300.00,
        redeemable: false,
        redeem_limit: 7,
        redeemed_count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'First Order Discount',
        description: 'Enjoy 15% off on your first order!',
        discount_percentage: 15.00,
        valid_from: new Date(),
        valid_to: new Date('2025-12-31'),
        min_order_amount: 0.00,
        redeemable: true,
        redeem_limit: 0,
        redeemed_count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Offers', null, {});
  }
};
