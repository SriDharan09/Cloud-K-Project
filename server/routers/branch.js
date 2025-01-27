const express = require('express');
const router = express.Router();
const { createBranch, getBranches, getBranchById, updateBranch, deleteBranch,getBranchWithDetails,filterBranches } = require('../controllers/branchController');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth'); 


// Create a new branch
router.post('/', authMiddleware,adminAuth, createBranch);

// Get all branches
router.get('/', authMiddleware, getBranches);

// Get a branch by ID
router.get('/:id', authMiddleware, getBranchById);

// Update a branch by ID
router.put('/:id', authMiddleware,adminAuth, updateBranch);

// Delete a branch by ID
router.delete('/:id', authMiddleware,adminAuth, deleteBranch);

router.get('/:id/details', authMiddleware,adminAuth,getBranchWithDetails);
router.post('/filter', authMiddleware,adminAuth,filterBranches);


module.exports = router;
