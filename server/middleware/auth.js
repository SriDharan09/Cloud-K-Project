const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SECRET_KEY = "RASH";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {

    const decoded = jwt.verify(token, SECRET_KEY);


    const user = await User.findByPk(decoded.id); // Note: Use decoded.id

    if (!user) {
      return res.status(401).json({ error: 'Invalid token - user not found' });
    }

    req.user = user;
    req.userCIFId = user.userCIFId;
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authMiddleware;
