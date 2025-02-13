const { sequelize } = require("../models");
const { Branch, AuditLog } = require("../models");
const branchLogger = require("../utils/logger/branchLogger");

exports.createBranch = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, body: req.body };
  const performedBy = req.userCIFId;

  try {
    const { name, address, phone_number } = req.body;
    console.log(req.file);
    if (!req.file) {
      console.error("🔴 No file uploaded!");
      return res.status(400).json({ error: "No file uploaded" });
  }
    const main_image = req.file ? req.file.path : null;

    const branch = await Branch.create({
      name,
      address,
      phone_number,
      mainImage: main_image,
    });

    // Log the creation action
    await AuditLog.create({
      tableName: "Branches",
      recordId: branch.id,
      action: "CREATE",
      newValues: branch.dataValues,
      performedBy,
      notes: "Branch created successfully.",
    });

    const response = {
      status: 201,
      message: "Branch created successfully",
      branch,
    };
    branchLogger.info("Branch created successfully", {
      req: requestInfo,
      res: response,
    });

    res.status(response.status).json(response);
  } catch (error) {
    const response = {
      status: 500,
      error: "Failed to create branch. Please try again later.",
    };
    branchLogger.error("Error creating branch", { req: requestInfo, error });
    res.status(response.status).json(response);
  }
};

exports.getBranches = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url };

  try {
    const branches = await Branch.findAll();
    const response = { status: 200, branches };
    branchLogger.info("Fetched all branches", {
      req: requestInfo,
      res: response,
    });

    res.json(response);
  } catch (error) {
    const response = {
      status: 500,
      error: "Failed to fetch branches. Please try again later.",
    };
    branchLogger.error("Error fetching branches", { req: requestInfo, error });
    res.status(response.status).json(response);
  }
};

exports.getBranchById = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, params: req.params };

  try {
    const { id } = req.params;
    const branch = await Branch.findByPk(id);
    if (!branch) {
      const response = { status: 404, error: "Branch not found" };
      branchLogger.warn("Branch not found", {
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }

    const response = { status: 200, branch };
    branchLogger.info("Fetched branch by ID", {
      req: requestInfo,
      res: response,
    });

    res.json(response);
  } catch (error) {
    const response = {
      status: 500,
      error: "Failed to fetch branch. Please try again later.",
    };
    branchLogger.error("Error fetching branch by ID", {
      req: requestInfo,
      error,
    });
    res.status(response.status).json(response);
  }
};

exports.updateBranch = async (req, res) => {
  const performedBy = req.userCIFId;
  const requestInfo = {
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
  };

  try {
    const { id } = req.params;
    const { name, address, phone_number } = req.body;
    const branch = await Branch.findByPk(id);

    if (!branch) {
      const response = { status: 404, error: "Branch not found" };
      branchLogger.warn("Branch not found", {
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }

    // Capture the old values before the update
    const oldValues = { ...branch.dataValues };

    // Perform the update
    await branch.update({ name, address, phone_number });

    // Capture the new values after the update
    const newValues = { ...branch.dataValues };

    // Log the update action
    await AuditLog.create({
      tableName: "Branches",
      recordId: branch.id,
      action: "UPDATE",
      oldValues: oldValues,
      newValues: newValues,
      performedBy,
      notes: "Branch updated successfully.",
    });

    const response = {
      status: 200,
      message: "Branch updated successfully",
      branch,
    };
    branchLogger.info("Branch updated successfully", {
      req: requestInfo,
      res: response,
    });

    res.json(response);
  } catch (error) {
    const response = {
      status: 500,
      error: "Failed to update branch. Please try again later.",
    };
    branchLogger.error("Error updating branch", { req: requestInfo, error });
    res.status(response.status).json(response);
  }
};

exports.deleteBranch = async (req, res) => {
  const performedBy = req.userCIFId;
  const requestInfo = { method: req.method, url: req.url, params: req.params };

  try {
    const { id } = req.params;
    const branch = await Branch.findByPk(id);

    if (!branch) {
      const response = { status: 404, error: "Branch not found" };
      branchLogger.warn("Branch not found", {
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }

    // Capture the old values before the deletion
    const oldValues = { ...branch.dataValues };
    console.log("Old values" + oldValues);

    // Perform the deletion
    await branch.destroy();

    // Log the delete action
    await AuditLog.create({
      tableName: "Branches",
      recordId: id,
      action: "DELETE",
      oldValues: oldValues,
      performedBy,
      notes: "Branch deleted successfully.",
    });

    const response = { status: 200, message: "Branch deleted successfully" };
    branchLogger.info("Branch deleted successfully", {
      req: requestInfo,
      res: response,
    });

    res.json(response);
  } catch (error) {
    const response = {
      status: 500,
      error: "Failed to delete branch. Please try again later.",
    };
    branchLogger.error("Error deleting branch", { req: requestInfo, error });
    res.status(response.status).json(response);
  }
};

exports.getBranchWithDetails = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, params: req.params };

  try {
    const { id } = req.params;

    const sqlQuery = `
      SELECT 
        b.id AS branchId,
        b.name AS branchName,
        b.address AS branchAddress,
        b.phone_number AS branchPhone,
        c.id AS categoryId,
        c.name AS categoryName,
        mi.id AS menuItemId,
        mi.name AS menuItemName,
        mi.description AS menuItemDescription,
        mi.price AS menuItemPrice,
        mi.status AS menuItemStatus,
        mi.imageUrl AS menuItemImageUrl,
        mi.rating AS menuItemRating,
        mi.preparationTime AS menuItemPreparationTime,
        mi.isSpecial AS menuItemIsSpecial,
        mi.discountPrice AS menuItemDiscountPrice,
        o.id AS orderId,
        o.total_price AS orderTotalPrice,
        o.status AS orderStatus
      FROM 
        Branches b
      LEFT JOIN 
        MenuItems mi ON b.id = mi.BranchId
      LEFT JOIN 
        Categories c ON mi.CategoryId = c.id
      LEFT JOIN 
        Orders o ON b.id = o.BranchId
      WHERE 
        b.id = :id
    `;

    const branchDetails = await sequelize.query(sqlQuery, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!branchDetails.length) {
      const response = { status: 404, error: "Branch not found" };
      branchLogger.warn("Branch not found", {
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }

    // Organize the data
    const organizedData = branchDetails.reduce((acc, row) => {
      let branch = acc.find((b) => b.id === row.branchId);
      if (!branch) {
        branch = {
          id: row.branchId,
          name: row.branchName,
          address: row.branchAddress,
          phone: row.branchPhone,
          categories: [],
          orders: [],
        };
        acc.push(branch);
      }

      if (row.categoryId) {
        let category = branch.categories.find((c) => c.id === row.categoryId);
        if (!category) {
          category = {
            id: row.categoryId,
            name: row.categoryName,
            menuItems: [],
          };
          branch.categories.push(category);
        }

        if (row.menuItemId) {
          let existingMenuItem = category.menuItems.find(
            (m) => m.id === row.menuItemId
          );
          if (!existingMenuItem) {
            category.menuItems.push({
              id: row.menuItemId,
              name: row.menuItemName,
              description: row.menuItemDescription,
              price: row.menuItemPrice,
              status: row.menuItemStatus,
              imageUrl: row.menuItemImageUrl,
              rating: row.menuItemRating,
              preparationTime: row.menuItemPreparationTime,
              isSpecial: row.menuItemIsSpecial,
              discountPrice: row.menuItemDiscountPrice,
            });
          }
        }
      }

      if (row.orderId) {
        let existingOrder = branch.orders.find((o) => o.id === row.orderId);
        if (!existingOrder) {
          branch.orders.push({
            id: row.orderId,
            totalPrice: row.orderTotalPrice,
            status: row.orderStatus,
          });
        }
      }

      return acc;
    }, []);

    const response = { status: 200, branch: organizedData[0] };
    branchLogger.info("Fetched branch with details", {
      req: requestInfo,
      res: response,
    });

    res.json(response);
  } catch (error) {
    // Log detailed error
    branchLogger.error("Error fetching branch with details", {
      req: requestInfo,
      error: error.message,
      stack: error.stack,
    });
    const response = {
      status: 500,
      error: "Failed to fetch branch details. Please try again later.",
    };
    res.status(response.status).json(response);
  }
};

// Controller to filter branches based on criteria
exports.filterBranches = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, body: req.body };

  try {
    const { branchName } = req.body;

    const sqlQuery = `
    SELECT 
    Branches.id AS branchId,
    Branches.name AS branchName,
    Branches.address AS branchAddress,
    Branches.phone_number AS branchPhone,
    Categories.id AS categoryId,
    Categories.name AS categoryName,
    MenuItems.id AS menuItemId,
    MenuItems.name AS menuItemName,
    MenuItems.description AS menuItemDescription,
    MenuItems.price AS menuItemPrice,
    MenuItems.status AS menuItemStatus,
    MenuItems.imageUrl AS menuItemImageUrl,
    MenuItems.rating AS menuItemRating,
    MenuItems.preparationTime AS menuItemPreparationTime,
    MenuItems.isSpecial AS menuItemIsSpecial,
    MenuItems.discountPrice AS menuItemDiscountPrice,
    Orders.id AS orderId,
    Orders.total_price AS orderTotalPrice,
    Orders.status AS orderStatus
  FROM 
    Branches
  LEFT JOIN 
    MenuItems ON Branches.id = MenuItems.BranchId
  LEFT JOIN 
    Categories ON Categories.id = MenuItems.CategoryId
  LEFT JOIN 
    Orders ON Branches.id = Orders.BranchId
  WHERE 
    (Branches.name = :branchName OR :branchName IS NULL)
  
    `;

    // Execute the query with parameters
    const branches = await sequelize.query(sqlQuery, {
      replacements: { branchName: branchName || null },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!branches.length) {
      const response = {
        status: 404,
        error: "No branches found based on the provided criteria.",
      };
      branchLogger.warn("No branches found", {
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }

    // Organize the data
    const organizedData = branches.reduce((acc, row) => {
      let branch = acc.find((b) => b.id === row.branchId);
      if (!branch) {
        branch = {
          id: row.branchId,
          name: row.branchName,
          address: row.branchAddress,
          phone: row.branchPhone,
          categories: [],
          orders: [],
        };
        acc.push(branch);
      }

      if (row.categoryId) {
        let category = branch.categories.find((c) => c.id === row.categoryId);
        if (!category) {
          category = {
            id: row.categoryId,
            name: row.categoryName,
            menuItems: [],
          };
          branch.categories.push(category);
        }

        if (row.menuItemId) {
          let existingMenuItem = category.menuItems.find(
            (m) => m.id === row.menuItemId
          );
          if (!existingMenuItem) {
            category.menuItems.push({
              id: row.menuItemId,
              name: row.menuItemName,
              description: row.menuItemDescription,
              price: row.menuItemPrice,
              status: row.menuItemStatus,
              imageUrl: row.menuItemImageUrl,
              rating: row.menuItemRating,
              preparationTime: row.menuItemPreparationTime,
              isSpecial: row.menuItemIsSpecial,
              discountPrice: row.menuItemDiscountPrice,
            });
          }
        }
      }

      if (row.orderId) {
        // ✅ CHECK IF ORDER ALREADY EXISTS
        let existingOrder = branch.orders.find((o) => o.id === row.orderId);
        if (!existingOrder) {
          branch.orders.push({
            id: row.orderId,
            totalPrice: row.orderTotalPrice,
            status: row.orderStatus,
          });
        }
      }

      return acc;
    }, []);

    const response = { status: 200, branches: organizedData };
    branchLogger.info("Filtered branches fetched successfully", {
      req: requestInfo,
      res: response,
    });

    res.status(response.status).json(response);
  } catch (error) {
    const response = {
      status: 500,
      error: "Failed to filter branches. Please try again later.",
    };
    branchLogger.error("Error fetching filtered branches", {
      req: requestInfo,
      error: error.message,
    });
    res.status(response.status).json(response);
  }
};
