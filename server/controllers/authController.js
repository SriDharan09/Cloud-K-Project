const bcrypt = require("bcryptjs");
const { User, Role } = require("../models");
const { generateToken } = require("../utils/jwt");
const logger = require("../utils/logger/authLogger");
const getRequestInfo = require("../utils/getRequestInfo");
const validatePassword = require("../utils/validatePassword");
const sendEmail = require("../utils/sendEmail");
const moment = require("moment-timezone");
const redis = require("../config/redis");

const {
  generateEmailTemplate,
  generatePasswordResetTemplate,
} = require("../utils/mailTemplate");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { log } = require("console");
const { title } = require("process");

const registrationCache = {};

const generateNumericCode = (length) => {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  console.log(code);
  return code;
};

const generateUniqueCIFId = async () => {
  const prefix = "CIF";

  let isUnique = false;
  let cifId = "";

  while (!isUnique) {
    const randomNumber = String(
      Math.floor(100000 + Math.random() * 900000),
    ).padStart(6, "0");
    cifId = `${prefix}${randomNumber}`;

    if (typeof cifId !== "string") {
      throw new Error("Generated CIF ID is not a string");
    }

    try {
      const existingUser = await User.findOne({ where: { userCIFId: cifId } });
      if (!existingUser) {
        isUnique = true;
      }
    } catch (error) {
      throw new Error("Error checking CIF ID uniqueness:", error);
    }
  }

  console.log("Generated CIF ID:", cifId);
  console.log("Type of CIF ID:", typeof cifId);

  return cifId;
};

// Registration Function
exports.register = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, body: req.body };

  try {
    const { username, email, password, RoleId } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      const response = {
        status: 400,
        title: "Registration Error",
        error: "All fields are required",
      };
      logger.warn("Registration attempt with missing fields", {
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }

    logger.info("Registration attempt", { req: requestInfo });

    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const response = {
        status: 400,
        title: "Registration Error",
        error: "Email is already registered.",
      };
      logger.warn("Registration failed - Email already registered", {
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }

    // Check if the role is valid
    const isAvailableRole = await Role.findOne({ where: { id: RoleId } });
    if (!isAvailableRole) {
      const response = {
        status: 400,
        title: "Registration Error",
        error: "Invalid role",
      };
      logger.warn("Registration failed - Invalid role", {
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }

    // Validate the password
    // const passwordErrors = await validatePassword(password);
    // if (passwordErrors.length > 0) {
    //   const response = {
    //     status: 400,
    //     title: "Registration Error",
    //     error: passwordErrors.join(", "),
    //   };
    //   logger.warn("Registration failed - Password validation failed", {
    //     req: requestInfo,
    //     res: response,
    //   });
    //   return res.status(response.status).json(response);
    // }

    // Generate a verification code
    const verificationCode = generateNumericCode(6);
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    // Save registration data temporarily
    registrationCache[email] = {
      username,
      password: await bcrypt.hash(password, 10),
      verificationCode,
      verificationCodeExpires,
      RoleId,
    };

    // Send verification email
    const localVerificationUrl = `http://localhost:3000/verify?code=${verificationCode}`;
    const htmlContent = generateEmailTemplate(
      verificationCode,
      localVerificationUrl,
    );
    await sendEmail({
      to: email,
      subject: "Verify Your Email Address",
      text: `Hello ${username}, please check the content for verification instructions.`,
      html: htmlContent,
    });

    const response = {
      status: 200,
      title: "Verify Your Email Address",
      message:
        "Verification code sent to your email. Please verify to complete registration.",
    };
    logger.info("Verification email sent", { req: requestInfo, res: response });

    res.status(response.status).json(response);
  } catch (error) {
    logger.error("Error during registration", { req: requestInfo, error });
    res
      .status(500)
      .json({ error: "Registration failed. Please try again later." });
  }
};

// Email Verification Function
exports.verifyEmail = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, body: req.body };

  try {
    logger.info("Email verification attempt", { req: requestInfo });

    const { email, verificationCode } = req.body;

    const userData = registrationCache[email];
    if (!userData) {
      const response = {
        status: 400,
        title: "Verification Error",
        error: "Verification code expired or invalid registration data.",
      };
      logger.warn("Verification failed - No registration data found", {
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }

    const {
      username,
      password,
      verificationCode: storedCode,
      verificationCodeExpires,
      RoleId,
    } = userData;

    if (
      storedCode !== verificationCode ||
      Date.now() > verificationCodeExpires
    ) {
      const response = {
        status: 400,
        title: "Verification Error",
        error: "Invalid or expired verification code.",
      };
      logger.warn(
        "Verification failed - Invalid or expired verification code",
        { req: requestInfo, res: response },
      );
      return res.status(response.status).json(response);
    }

    const userCIFId = await generateUniqueCIFId();
    if (typeof userCIFId !== "string") {
      userCIFId = String(userCIFId);
    }

    const newUser = await User.create({
      username,
      email,
      password,
      userCIFId,
      RoleId,
      loginAttempts: 0,
      lastLoginAttempt: null,
      preferences: {},
      isEmailVerified: true,
      isActive: true,
    });

    delete registrationCache[email];

    const response = {
      status: 201,
      title: "Registration Completed",
      message: "Email verified successfully. Registration completed!",
      user: {
        username: newUser.username,
        email: newUser.email,
        userCIFId: newUser.userCIFId,
      },
    };
    logger.info("User registered successfully", {
      req: requestInfo,
      res: response,
    });

    res.status(response.status).json(response);
  } catch (error) {
    logger.error("Error during email verification", {
      req: requestInfo,
      error,
    });
    res.status(500).json({
      title: "Verification Error",
      error: "Verification failed. Please try again later.",
    });
  }
};

exports.login = async (req, res) => {
  const requestInfo = getRequestInfo(req, ["password"]);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const response = {
        status: 400,
        title: "Login Error",
        message: "Email and password are required",
      };
      logger.warn("Login attempt with missing fields", {
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, attributes: ["id", "name"] }],
    });

    if (!user) {
      const response = {
        status: 400,
        title: "Login Error",
        message: "Invalid credentials",
      };
      logger.info("Login failed - user not found", {
        email,
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }
    console.log(new Date() - new Date(user.lastLoginAttempt) < 30 * 60 * 1000);
    if (
      user.loginAttempts >= 5 &&
      new Date() - new Date(user.lastLoginAttempt) < 30 * 60 * 1000
    ) {
      const lockDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
      const lastAttemptTime = new Date(user.lastLoginAttempt);
      const unlockTime = new Date(lastAttemptTime.getTime() + lockDuration);
      const formattedUnlockTime = moment(unlockTime)
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");

      const response = {
        status: 403,
        title: "Login Error",
        message: "Account locked for 30 mins. Try again later.",
        unlocksAt: formattedUnlockTime, // Now in IST format
      };
      logger.warn("Account locked due to multiple failed login attempts", {
        email,
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      await user.update({
        loginAttempts: user.loginAttempts + 1,
        lastLoginAttempt: new Date(),
      });

      const response = {
        status: 400,
        title: "Login Error",
        message: "Invalid credentials",
      };
      logger.info("Login failed - invalid password", {
        email,
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }

    await user.update({
      loginAttempts: 0,
      lastLoginAttempt: new Date(),
    });

    const token = generateToken(user);

    const response = {
      status: 200,
      title: "Login Success",
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        cifId: user.userCIFId,
        roleId: user.Role.id,
        profileImage: user.profileImage,
        roleName: user.Role.name,
      },
    };

    logger.info("User logged in successfully", {
      email: user.email,
      req: requestInfo,
      res: response,
    });

    res.status(response.status).json(response);
  } catch (error) {
    const response = {
      status: 500,
      title: "Login Error",
      message: "we're facing some techincal diffiulties please try again",
    };
    logger.error("Login error", { error, req: requestInfo, res: response });
    res.status(response.status).json(response);
  }
};

exports.forgotPassword = async (req, res) => {
  const requestInfo = { method: req.method, url: req.url, body: req.body };

  try {
    logger.info("Password reset request received", { req: requestInfo });

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const response = {
        status: 404,
        title: "Password Reset Error",
        error: "User not found",
      };
      logger.warn("Password reset request failed - User not found", {
        req: requestInfo,
        res: response,
      });
      return res.status(response.status).json(response);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 5 * 60 * 1000;

    await user.update({
      resetToken,
      resetTokenExpires,
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    console.log("resetUrl", resetUrl);
    const htmlContent = generatePasswordResetTemplate(resetUrl);
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
      html: htmlContent,
    });

    const response = {
      status: 200,
      message:
        "Password reset email sent to your registered mail address. Link will expire in 5 mins",
    };
    logger.info("Password reset email sent successfully", {
      req: requestInfo,
      res: response,
    });

    res.status(response.status).json(response);
  } catch (error) {
    logger.error("Error during password reset request", {
      req: requestInfo,
      error,
    });
    res.status(500).json({
      error:
        "Failed to process password reset request. Please try again later.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const requestInfo = {
    method: req.method,
    url: req.url,
    body: req.body,
  };

  try {
    const { newPassword } = req.body;

    const token = req.params.token;

    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpires: {
          [Op.gt]: Date.now(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired token",
      });
    }

    // const passwordErrors = await validatePassword(newPassword);

    // if (passwordErrors.length) {
    //   return res.status(400).json({
    //     error: passwordErrors.join(", "),
    //   });
    // }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    });

    return res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    logger.error("Error resetting password", {
      req: requestInfo,
      error,
    });

    return res.status(500).json({
      error: "Failed to reset password",
    });
  }
};
exports.logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    // blacklist token until it naturally expires
    await redis.setex(`blacklist:${token}`, 3600, "1");
  }
  res.status(200).json({ message: "Logged out successfully" });
};
