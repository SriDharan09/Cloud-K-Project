const { Cart } = require("../models");

// Fetch cart for a user
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(200).json({ cartData: {} });
    }

    res.status(200).json(cart.cartData);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add or update items in the cart
exports.addToCart = async (req, res) => {
  try {
    const { BranchId, MenuItemId, quantity, name, price, menuImage } = req.body;
    const userId = req.userCIFId;

    // Convert single item to an array if necessary
    const items = Array.isArray(req.body.items)
      ? req.body.items
      : [{ menuItemId: MenuItemId, quantity, name, price, menuImage }];

    let cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      // Create a new cart with the first item
      cart = await Cart.create({
        userId,
        cartData: {
          [BranchId]: {
            BranchId,
            items,
          },
        },
      });
    } else {
      let cartData = cart.cartData || {};

      // If branch doesn't exist in cartData, initialize it
      if (!cartData[BranchId]) {
        cartData[BranchId] = { BranchId, items: [] };
      }

      // Iterate over new items and update existing ones if needed
      for (const newItem of items) {
        const existingItem = cartData[BranchId].items.find(
          (item) => item.menuItemId === newItem.menuItemId
        );

        if (existingItem) {
          existingItem.quantity += newItem.quantity; // Increase quantity
        } else {
          cartData[BranchId].items.push(newItem); // Add new item
        }
      }

      // Update the cart in the database
      await cart.update({ cartData });
    }

    res.status(200).json({
      message: "Cart updated successfully",
      cartData: cart.cartData,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Update quantity of an item
exports.updateCartItem = async (req, res) => {
  try {
    const { branchId, menuItemId, quantity } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    let cartData = cart.cartData;
    if (!cartData[branchId])
      return res.status(404).json({ error: "Branch not found in cart" });

    const item = cartData[branchId].items.find(
      (i) => i.menuItemId === menuItemId
    );
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.quantity = quantity > 0 ? quantity : 1;

    await cart.update({ cartData });
    res.status(200).json({ message: "Cart updated", cartData });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
  try {
    const { branchId, menuItemId } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    let cartData = cart.cartData;
    if (!cartData[branchId])
      return res.status(404).json({ error: "Branch not found in cart" });

    cartData[branchId].items = cartData[branchId].items.filter(
      (item) => item.menuItemId !== menuItemId
    );

    if (cartData[branchId].items.length === 0) {
      delete cartData[branchId];
    }

    await cart.update({ cartData });
    res.status(200).json({ message: "Item removed from cart", cartData });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Clear the cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.update({ cartData: {} }, { where: { userId } });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
