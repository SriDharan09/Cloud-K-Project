const express = require("express");
const router = express.Router();
const {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  getMenuByOther,
} = require("../controllers/menuController");
const cache = require("../middleware/cache");
const authMiddleware = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const createUploadMiddleware = require("../middleware/upload");
const upload = createUploadMiddleware("menus");

router.post(
  "/",
  upload.single("menuImage"),
  authMiddleware,
  adminAuth,
  createMenuItem,
);
router.get(
  "/",
  cache(() => "menu:all", 3600),
  getMenuItems,
);
router.post("/filter", getMenuByOther);
router.get(
  "/:id",
  cache((req) => `menu${req.param.id}`, 3600),
  getMenuItemById,
);
router.put("/:id", authMiddleware, adminAuth, updateMenuItem);
router.delete("/:id", authMiddleware, adminAuth, deleteMenuItem);

module.exports = router;
