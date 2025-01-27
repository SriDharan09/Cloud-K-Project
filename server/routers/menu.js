const express = require('express');
const router = express.Router();
const { createMenuItem, getMenuItems, getMenuItemById, updateMenuItem, deleteMenuItem,getMenuByOther } = require('../controllers/menuController');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth'); 


router.post('/', authMiddleware,adminAuth, createMenuItem);
router.get('/', getMenuItems);
router.post('/filter', getMenuByOther);
router.get('/:id', getMenuItemById);
router.put('/:id', authMiddleware,adminAuth, updateMenuItem);
router.delete('/:id', authMiddleware,adminAuth, deleteMenuItem);

module.exports = router;
