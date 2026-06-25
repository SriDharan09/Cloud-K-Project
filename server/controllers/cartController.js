const cartService = require("../services/cartService");

exports.getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.userCIFId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { BranchId, MenuItemId, quantity, items } = req.body;
    const userId = req.userCIFId;

    const normalizedItems = Array.isArray(items)
      ? items
      : [{ menuItemId: MenuItemId, quantity }];

    const cart = await cartService.addToCart(userId, BranchId, normalizedItems);
    res.status(200).json({ message: "Cart updated successfully", cartData: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { branchId, menuItemId, quantity } = req.body;
    const cart = await cartService.updateCartItem(req.userCIFId, branchId, menuItemId, quantity);
    res.status(200).json({ message: "Cart updated", cartData: cart });
  } catch (error) {
    res.status(error.message === "Item not found in cart" ? 404 : 500)
      .json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { branchId, menuItemId } = req.body;
    const cart = await cartService.removeFromCart(req.userCIFId, branchId, menuItemId);
    res.status(200).json({ message: "Item removed from cart", cartData: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await cartService.clearCart(req.userCIFId);
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};