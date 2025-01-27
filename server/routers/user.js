const express = require('express');
const router = express.Router();
const { getUserDetails, updateUserDetails, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.get('/:id', authMiddleware, getUserDetails);
router.put('/:id', authMiddleware, updateUserDetails);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
