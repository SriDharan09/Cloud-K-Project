const { CartItem, MenuItem, Branch } = require("../models");

// Get cart grouped by branch (same shape your frontend expects)
exports.getCart = async (userId) => {
  const items = await CartItem.findAll({
    where: { userId },
    include: [
      {
        model: MenuItem,
        attributes: ["id", "name", "price", "menuImage", "BranchId"],
      },
    ],
  });

  // Group by branchId — same structure your frontend already uses
  return items.reduce((acc, item) => {
    const bId = item.branchId;
    if (!acc[bId]) acc[bId] = { BranchId: bId, items: [] };
    acc[bId].items.push({
      menuItemId: item.menuItemId,
      name: item.MenuItem.name,
      price: item.MenuItem.price,
      menuImage: item.MenuItem.menuImage,
      quantity: item.quantity,
    });
    return acc;
  }, {});
};

exports.addToCart = async (userId, branchId, items) => {
  for (const { menuItemId, quantity } of items) {
    const [cartItem, created] = await CartItem.findOrCreate({
      where: { userId, branchId, menuItemId },
      defaults: { quantity },
    });

    if (!created) {
      // Item exists — increment quantity
      await cartItem.increment("quantity", { by: quantity });
    }
  }
  return exports.getCart(userId);
};

exports.updateCartItem = async (userId, branchId, menuItemId, quantity) => {
  const item = await CartItem.findOne({
    where: { userId, branchId, menuItemId },
  });
  if (!item) throw new Error("Item not found in cart");

  await item.update({ quantity: Math.max(1, quantity) });
  return exports.getCart(userId);
};

exports.removeFromCart = async (userId, branchId, menuItemId) => {
  await CartItem.destroy({ where: { userId, branchId, menuItemId } });
  return exports.getCart(userId);
};

exports.clearCart = async (userId) => {
  await CartItem.destroy({ where: { userId } });
  return {};
};
