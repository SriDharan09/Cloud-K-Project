const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder, cancelOrder ,getFilteredOrder} = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getFilteredOrder);
router.get('/getFilteredOrder', authMiddleware, getOrderById);
router.put('/:id/cancel', authMiddleware, cancelOrder);
router.put('/:id/status', authMiddleware, updateOrderStatus);
router.delete('/:id', authMiddleware, deleteOrder);

module.exports = router;
