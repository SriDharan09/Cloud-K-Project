const { MenuItem, Category, Branch, AuditLog } = require("../models");
const { Op } = require("sequelize");
const menuItemLogger = require("../utils/logger/menuItemLogger");

exports.createMenuItem = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, body: req.body };
  const performedBy = req.userCIFId;
  try {
    const {
      name,
      description,
      price,
      CategoryId,
      BranchId,
      status,
      imageUrl,
      rating,
      preparationTime,
      isSpecial,
      discountPrice,
    } = req.body;
    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      CategoryId,
      BranchId,
      status,
      imageUrl,
      rating,
      preparationTime,
      isSpecial,
      discountPrice,
    });

    // Log the creation action
    await AuditLog.create({
      tableName: "MenuItems",
      recordId: menuItem.id,
      action: "CREATE",
      newValues: menuItem.dataValues,
      performedBy,
      notes: "Menu item created successfully.",
    });

    menuItemLogger.info("Menu item created successfully", {
      req: requestInfo,
      performedBy,
    });

    res.status(201).json(menuItem);
  } catch (error) {
    menuItemLogger.error("Error creating menu item", {
      req: requestInfo,
      error,
    });
    res.status(400).json({ error: error.message });
  }
};

exports.getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll({ include: [Category, Branch] });
    res.json(menuItems);
  } catch (error) {
    menuItemLogger.error("Error fetching menu items", { error });
    res.status(400).json({ error: error.message });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id, {
      include: [Category, Branch],
    });
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(menuItem);
  } catch (error) {
    menuItemLogger.error("Error fetching menu item by ID", { error });
    res.status(400).json({ error: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, body: req.body };
  const performedBy = req.userCIFId;

  try {
    const {
      name,
      description,
      price,
      CategoryId,
      BranchId,
      status,
      imageUrl,
      rating,
      preparationTime,
      isSpecial,
      discountPrice,
    } = req.body;
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    const oldValues = { ...menuItem.dataValues };
    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.CategoryId = CategoryId || menuItem.CategoryId;
    menuItem.BranchId = BranchId || menuItem.BranchId;
    menuItem.status = status || menuItem.status;
    menuItem.imageUrl = imageUrl || menuItem.imageUrl;
    menuItem.rating = rating || menuItem.rating;
    menuItem.preparationTime = preparationTime || menuItem.preparationTime;
    menuItem.isSpecial = isSpecial || menuItem.isSpecial;
    menuItem.discountPrice = discountPrice || menuItem.discountPrice;

    await menuItem.save();
    const newValues = { ...menuItem.dataValues };

    // Log the update action
    await AuditLog.create({
      tableName: "MenuItems",
      recordId: menuItem.id,
      action: "UPDATE",
      oldValues,
      newValues,
      changes: {
        name: { old: oldValues.name, new: name },
        description: { old: oldValues.description, new: description },
        price: { old: oldValues.price, new: price },
        // Add other fields here similarly if necessary
      },
      performedBy,
      notes: "Menu item updated successfully.",
    });

    menuItemLogger.info("Menu item updated successfully", {
      req: requestInfo,
      performedBy,
    });

    res.json(menuItem);
  } catch (error) {
    menuItemLogger.error("Error updating menu item", {
      req: requestInfo,
      error,
    });
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, params: req.params };
  const performedBy = req.userCIFId;

  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    const oldValues = { ...menuItem.dataValues };
    await menuItem.destroy();

    // Log the delete action
    await AuditLog.create({
      tableName: "MenuItems",
      recordId: menuItem.id,
      action: "DELETE",
      oldValues,
      performedBy,
      notes: "Menu item deleted successfully.",
    });

    menuItemLogger.info("Menu item deleted successfully", {
      req: requestInfo,
      performedBy,
    });

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    menuItemLogger.error("Error deleting menu item", {
      req: requestInfo,
      error,
    });
    res.status(400).json({ error: error.message });
  }
};

exports.getMenuByOther = async (req, res) => {
  try {
    const { categoryId, branchId } = req.body;

    // Ensure branchId is provided and filter strictly by BranchId = 3
    const whereClause = {};
    if (branchId) whereClause.BranchId = branchId;
    if (categoryId) whereClause.CategoryId = categoryId;

    // Query only for the specified branchId
    const menuItems = await MenuItem.findAll({
      where: whereClause,
      attributes: [
        "id",
        "name",
        "description",
        "price",
        "status",
        "imageUrl",
        "rating",
        "preparationTime",
        "isSpecial",
        "discountPrice",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Category,
          attributes: ["id", "name"], // Include only relevant category data
        },
        {
          model: Branch,
          attributes: ["id", "name"], // Include only relevant branch data
        },
      ],
    });

    // Check if data exists
    if (!menuItems.length) {
      return res
        .status(404)
        .json({
          message: "No menu items found for the given branch and category.",
        });
    }

    res.json(menuItems);
  } catch (error) {
    menuItemLogger.error("Error fetching menu items", { error });
    res
      .status(500)
      .json({ error: "Failed to fetch menu items. Please try again later." });
  }
};
