const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory,searchCategories } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth'); 


router.get('/search', searchCategories);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', authMiddleware, adminAuth,  createCategory);
router.put('/:id',authMiddleware, adminAuth,  updateCategory);
router.delete('/:id',authMiddleware, adminAuth,  deleteCategory);


module.exports = router;
