const bcrypt = require("bcryptjs");
const { User } = require("../models");
const logger = require("../utils/logger/authLogger");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Fetched profile successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, phoneNumber, address, preferences } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    await user.update({
      username,
      phoneNumber,
      address: address ? JSON.stringify(address) : user.address,
      preferences: preferences ? JSON.stringify(preferences) : user.preferences,
    });

    res.status(200).json({
      status: 200,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    console.log("🔍 Full Request:", req.body);
    console.log(oldPassword + " " + newPassword);
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        status: 400,
        message: "Password must be at least 6 characters long.",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: 400,
        message: "Incorrect old password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      status: 200,
      message: "Password changed successfully",
    });
  } catch (error) {
    logger.error("Error changing password", { error });
    res.status(500).json({
      status: 500,
      message: "Password update failed",
    });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 Full Request:", req.body);
    console.log("📂 Uploaded File:", req.file);

    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: "No image uploaded",
      });
    }

    const imageUrl = req.file.path;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({
      status: 200,
      message: "Profile image updated successfully",
      profileImage: imageUrl,
    });
  } catch (error) {
    logger.error("Error uploading profile image", { error });
    res.status(500).json({
      status: 500,
      message: "Image upload failed",
    });
  }
};
