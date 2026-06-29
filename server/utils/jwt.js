const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      RoleId: user.RoleId,
      userCIFId: user.userCIFId,
    },
    SECRET_KEY,
    { expiresIn: "1h" },
  );
};

module.exports = { generateToken };
