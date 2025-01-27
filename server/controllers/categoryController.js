const { Category,AuditLog } = require('../models');
const { Op } = require('sequelize');
const categoryLogger = require('../utils/categoryLogger'); // Update the path if needed

exports.createCategory = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, body: req.body };
  const performedBy = req.userCIFId;

  try {
    const { name } = req.body;
    const category = await Category.create({ name });

    // Log the creation action
    await AuditLog.create({
      tableName: 'Categories',
      recordId: category.id,
      action: 'CREATE',
      newValues: category.dataValues,
      performedBy,
      notes: 'Category created successfully.',
    });

    categoryLogger.info('Category created successfully', { req: requestInfo, performedBy });
    res.status(201).json(category);
  } catch (error) {
    // Improved error logging
    categoryLogger.error('Error creating category', { req: requestInfo, error: error.message || error });
    res.status(400).json({ error: error.message || 'An error occurred while creating the category.' });
  }
};
exports.getCategories = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, query: req.query };
  try {
    const { page = 1, limit = 10, name } = req.query;

    const where = {};
    if (name) {
      where.name = { [Op.like]: `%${name}%` }; // Case-insensitive search
    }

    const { count, rows: categories } = await Category.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
    });

    const response = {
      status: 200,
      message: 'Fetched categories successfully',
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      limit: parseInt(limit, 10),
      categories,
    };
    categoryLogger.info('Fetched categories successfully', { req: requestInfo, res: response });

    res.json(response);
  } catch (error) {
    const response = { status: 400, error: 'Failed to fetch categories. Please try again later.' };
    categoryLogger.error('Error fetching categories', { req: requestInfo, error });
    res.status(response.status).json(response);
  }
};

exports.getCategoryById = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, params: req.params };
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      const response = { status: 404, error: 'Category not found' };
      categoryLogger.warn('Category not found', { req: requestInfo, res: response });
      return res.status(response.status).json(response);
    }

    const response = { status: 200, category };
    categoryLogger.info('Fetched category by ID successfully', { req: requestInfo, res: response });

    res.json(response);
  } catch (error) {
    const response = { status: 400, error: 'Failed to fetch category. Please try again later.' };
    categoryLogger.error('Error fetching category by ID', { req: requestInfo, error });
    res.status(response.status).json(response);
  }
};

exports.updateCategory = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, body: req.body, params: req.params };
  const performedBy = req.userCIFId;

  try {
    const { name } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      const response = { status: 404, error: 'Category not found' };
      categoryLogger.warn('Category not found for update', { req: requestInfo, res: response });
      return res.status(response.status).json(response);
    }

    const oldValues = { ...category.dataValues };

    // Update the category
    category.name = name;
    await category.save();

    // Clone new values after saving
    const newValues = { ...category.dataValues };


    // Log the update action
    await AuditLog.create({
      tableName: 'Categories',
      recordId: category.id,
      action: 'UPDATE',
      oldValues,
      newValues,
      changes: { name: { old: oldValues.name, new: name } },
      performedBy,
      notes: 'Category updated successfully.',
    });

    const response = { status: 200, message: 'Category updated successfully', category };
    categoryLogger.info('Category updated successfully', { req: requestInfo, res: response });

    res.json(response);
  } catch (error) {
    const response = { status: 400, error: 'Failed to update category. Please try again later.' };
    categoryLogger.error('Error updating category', { req: requestInfo, error });
    res.status(response.status).json(response);
  }
};

exports.deleteCategory = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, params: req.params };
  const performedBy = req.userCIFId;

  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      const response = { status: 404, error: 'Category not found' };
      categoryLogger.warn('Category not found for deletion', { req: requestInfo, res: response });
      return res.status(response.status).json(response);
    }

    const oldValues = { ...category.dataValues }
    await category.destroy();

    // Log the delete action
    await AuditLog.create({
      tableName: 'Categories',
      recordId: category.id,
      action: 'DELETE',
      oldValues,
      performedBy,
      notes: 'Category deleted successfully.',
    });

    const response = { status: 200, message: 'Category deleted successfully' };
    categoryLogger.info('Category deleted successfully', { req: requestInfo, res: response });

    res.json(response);
  } catch (error) {
    const response = { status: 400, error: 'Failed to delete category. Please try again later.' };
    categoryLogger.error('Error deleting category', { req: requestInfo, error });
    res.status(response.status).json(response);
  }
};

exports.searchCategories = async (req, res) => {
  const { q } = req.query;
  const requestInfo = { method: req.method, url: req.url, query: req.query };
  
  try {
    const categories = await Category.findAll({
      where: {
        name: {
          [Op.like]: `%${q}%`,
        },
      },
    });

    if (!categories.length) {
      const response = { status: 404, error: 'Category not found' };
      categoryLogger.warn('Category search returned no results', { req: requestInfo, res: response });
      return res.status(response.status).json(response);
    }

    const response = { status: 200, categories };
    categoryLogger.info('Category search completed successfully', { req: requestInfo, res: response });

    res.json(response);
  } catch (error) {
    const response = { status: 500, error: 'Failed to search categories. Please try again later.' };
    categoryLogger.error('Error searching categories', { req: requestInfo, error });
    res.status(response.status).json(response);
  }
};
