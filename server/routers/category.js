const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  searchCategories,
} = require("../controllers/categoryController");
const authMiddleware = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const createUploadMiddleware = require("../middleware/upload");
const upload = createUploadMiddleware("categories");

router.get("/search", searchCategories);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post(
  "/",
  upload.single("categoryImage"),
  authMiddleware,
  adminAuth,
  createCategory
);
router.put("/:id", authMiddleware, adminAuth, updateCategory);
router.delete("/:id", authMiddleware, adminAuth, deleteCategory);

module.exports = router;
