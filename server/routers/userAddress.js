const express = require('express');
const router = express.Router();
const { addAddress, updateAddress, deleteAddress, getUserAddresses } = require('../controllers/userAddressController');
const authMiddleware = require('../middleware/auth');

router.get('/user/:userId', authMiddleware, getUserAddresses);
router.post('/', authMiddleware, addAddress);
router.put('/:id', authMiddleware, updateAddress);
router.delete('/:id', authMiddleware, deleteAddress);

module.exports = router;
