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
const upload = require("../config/multerConfig");
const multer = require("multer");


const uploadMiddleware = (req, res, next) => {
  upload.single("main_image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer Error:", err);
      return res.status(400).json({ error: `Multer error: ${err.message}` });
    } else if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    next();
  });
};

// Create a new branch
router.post("/", uploadMiddleware, authMiddleware, adminAuth, createBranch);

// Get all branches
router.get("/", getBranches);

// Get a branch by ID
router.get("/:id", getBranchById);

// Update a branch by ID
router.put("/:id", authMiddleware, adminAuth, updateBranch);

// Delete a branch by ID
router.delete("/:id", authMiddleware, adminAuth, deleteBranch);

router.get("/:id/details", getBranchWithDetails);
router.post("/filter", filterBranches);

module.exports = router;
