const { User, Role } = require('../models');

const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [Role]
    });
    
    if (!user || user.Role.name !== 'Admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = adminAuth;
