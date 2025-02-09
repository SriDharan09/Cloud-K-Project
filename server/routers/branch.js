const express = require("express");
const router = express.Router();
const {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  getBranchWithDetails,
  filterBranches,
} = require("../controllers/branchController");
const authMiddleware = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

// Create a new branch
router.post("/", authMiddleware, adminAuth, createBranch);

// Get all branches
router.get("/", getBranches);

// Get a branch by ID
router.get("/:id", getBranchById);

// Update a branch by ID
router.put("/:id", authMiddleware, adminAuth, updateBranch);

// Delete a branch by ID
router.delete("/:id", authMiddleware, adminAuth, deleteBranch);

router.get("/:id/details",  getBranchWithDetails);
router.post("/filter", filterBranches);

module.exports = router;
