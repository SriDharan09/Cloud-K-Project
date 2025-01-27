const jwt = require('jsonwebtoken');

const SECRET_KEY = "RASH";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      RoleId: user.RoleId,
      userCIFId: user.userCIFId
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

module.exports = { generateToken };
