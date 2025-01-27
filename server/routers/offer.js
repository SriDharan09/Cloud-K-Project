const express = require('express');
const router = express.Router();
const { createOffer, updateOffer, deleteOffer, getAllOffers } = require('../controllers/offerController');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth'); 

router.get('/', getAllOffers);
router.post('/', authMiddleware, adminAuth, createOffer);
router.put('/:id', authMiddleware, adminAuth, updateOffer);
router.delete('/:id', authMiddleware, adminAuth, deleteOffer);

module.exports = router;
