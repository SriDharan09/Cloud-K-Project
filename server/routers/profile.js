const express = require("express");
const {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
} = require("../controllers/profileController");
const authMiddleware = require("../middleware/auth");
const createUploadMiddleware = require("../middleware/upload");
const upload = createUploadMiddleware("profiles");

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.post(
  "/upload-image",
  authMiddleware,
  upload.single("profileImage"),
  uploadProfileImage
);
router.put("/", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
