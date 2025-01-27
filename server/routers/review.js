const express = require('express');
const router = express.Router();
const { addReview, updateReview, deleteReview, getMenuItemReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, addReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);
router.get('/menuItem/:menuItemId', getMenuItemReviews);

module.exports = router;
