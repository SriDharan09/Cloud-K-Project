const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  changePassword,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/verifyUser", verifyEmail);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPass/:token", resetPassword);
router.post("/logout", logout);

module.exports = router;
