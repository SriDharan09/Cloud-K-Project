const bcrypt = require("bcryptjs");
const { User } = require("../models");
const logger = require("../utils/logger/authLogger");
const cloudinary = require("cloudinary").v2;

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
    console.log("🔍 Full Request:", req.body);

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    // Prepare update fields
    const updatedData = {};
    if (username) updatedData.username = username;
    if (phoneNumber) updatedData.phoneNumber = phoneNumber;
    if (address) updatedData.address =address; // Store as JSON string
    if (preferences) updatedData.preferences = preferences; // Store as JSON string

    // Update the user
    await user.update(updatedData);

    res.status(200).json({
      status: 200,
      message: "Profile updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address, // Ensure correct parsing
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        preferences: user.preferences, // Ensure correct parsing
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        RoleId: user.RoleId,
      },
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

    const oldImage = user.profileImage;

    if (oldImage) {
      try {
        const urlParts = oldImage.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId =
          filename.substring(0, filename.lastIndexOf(".")) || filename;

        const folder = "profiles/";
        const oldImagePublicId = `${folder}${publicId}`;

        console.log(" Extracted Public ID:", oldImagePublicId);

        const result = await cloudinary.uploader.destroy(oldImagePublicId);

        console.log("🔄 Cloudinary Delete Response:", result);

        if (result.result !== "ok") {
          console.warn(
            "⚠️ Warning: Image might not have been deleted. Cloudinary response:",
            result
          );
        }
      } catch (error) {
        console.error("❌ Error deleting old profile image:", error);
      }
    } else {
      console.log("ℹ️ No existing profile image to delete.");
    }

    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({
      status: 200,
      message: "Profile image updated successfully",
      profileImage: imageUrl,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({
      status: 500,
      message: "Image upload failed",
    });
  }
};
