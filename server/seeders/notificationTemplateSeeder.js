module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("NotificationTemplates", [
      {
        key: "orderPlaced",
        type: "order_status",
        title: "Order Placed Successfully!",
        message: "Your order #{{orderId}} has been placed successfully.",
      },
      {
        key: "orderStatusUpdate",
        type: "order_status",
        title: "Order Status Update",
        message: "Your order #{{orderId}} is now {{status}}.",
      },
      {
        key: "profileUpdate",
        type: "profile_update",
        title: "Profile Updated",
        message: "Your profile information has been updated successfully.",
      },
      {
        key: "promotion1",
        type: "promotion",
        title: "Flash Sale!",
        message: "Get 30% off on all items for the next 24 hours!",
      },
      {
        key: "promotion2",
        type: "promotion",
        title: "Weekend Special",
        message: "Enjoy a free dessert with every meal this weekend!",
      },
      {
        key: "generalUpdate1",
        type: "general",
        title: "Thank You for Being With Us!",
        message: "We appreciate your support. Stay tuned for more updates!",
      },
      {
        key: "orderPreparing",
        type: "order_status",
        title: "Order is Being Prepared",
        message:
          "Your order #{{orderId}} is now being prepared. It will be ready soon!",
      },
      {
        key: "orderOnTheWay",
        type: "order_status",
        title: "Order is On The Way",
        message:
          "Your order #{{orderId}} is on the way! Get ready to receive it.",
      },
      {
        key: "orderDelivered",
        type: "order_status",
        title: "Order Delivered Successfully",
        message: "Your order #{{orderId}} has been delivered. Enjoy your meal!",
      },

      {
        key: "promotion3",
        type: "promotion",
        title: "Happy Hour Deal!",
        message: "Get 50% off on selected items from 3 PM to 6 PM today!",
      },
      {
        key: "promotion4",
        type: "promotion",
        title: "Buy One Get One Free!",
        message: "Order any main course and get another one for free!",
      },
      {
        key: "promotion5",
        type: "promotion",
        title: "Exclusive App Offer!",
        message: "Use code APP20 to get 20% off on your first app order!",
      },
      {
        key: "promotion6",
        type: "promotion",
        title: "Limited Time Discount!",
        message: "Grab a flat 25% discount on your next order. Hurry up!",
      },
      {
        key: "promotion7",
        type: "promotion",
        title: "Midnight Cravings?",
        message: "Late-night orders get a free drink! Available 10 PM - 2 AM.",
      },
      {
        key: "promotion8",
        type: "promotion",
        title: "Combo Special!",
        message: "Order a meal combo and save up to 30%!",
      },
      {
        key: "promotion9",
        type: "promotion",
        title: "Loyalty Bonus!",
        message: "Earn double points on all orders this week!",
      },
      {
        key: "promotion10",
        type: "promotion",
        title: "Refer & Earn!",
        message: "Refer a friend and both of you get ₹100 off your next order!",
      },
      {
        key: "promotion11",
        type: "promotion",
        title: "Dine-In Discount!",
        message: "Enjoy 20% off when you dine in at our partner restaurants!",
      },
      {
        key: "promotion12",
        type: "promotion",
        title: "Weekend Party Pack!",
        message: "Get 4 large pizzas at just ₹999! Limited time only.",
      },

      {
        key: "generalUpdate2",
        type: "general",
        title: "New Features Available!",
        message:
          "Check out our latest updates for a better ordering experience.",
      },
      {
        key: "generalUpdate3",
        type: "general",
        title: "Festive Greetings!",
        message:
          "Wishing you a joyful festive season! Enjoy special discounts!",
      },
      {
        key: "generalUpdate4",
        type: "general",
        title: "Your Feedback Matters!",
        message: "We'd love to hear from you. Rate your last order now!",
      },
      {
        key: "generalUpdate5",
        type: "general",
        title: "New Restaurants Added!",
        message: "Explore exciting new restaurants now available in your area.",
      },
      {
        key: "generalUpdate6",
        type: "general",
        title: "Exciting Rewards Coming Soon!",
        message: "Stay tuned for our upcoming loyalty program and earn more!",
      },
      {
        key: "generalUpdate7",
        type: "general",
        title: "We Are Expanding!",
        message: "Now delivering in more cities. Find out if we're in yours!",
      },
      {
        key: "generalUpdate8",
        type: "general",
        title: "Security Update",
        message:
          "We’ve improved account security. Make sure to update your app!",
      },
      {
        key: "generalUpdate9",
        type: "general",
        title: "Order Faster!",
        message: "Save your favorite meals and reorder with just one tap!",
      },
      {
        key: "generalUpdate10",
        type: "general",
        title: "Personalized Recommendations!",
        message:
          "Get food suggestions based on your order history. Try it now!",
      },
      {
        key: "generalUpdate11",
        type: "general",
        title: "Stay Updated!",
        message: "Enable notifications to never miss a great deal!",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("NotificationTemplates", null, {});
  },
};
