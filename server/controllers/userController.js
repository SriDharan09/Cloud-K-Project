const { User, Role } = require('../models');

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [Role],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user details
exports.updateUserDetails = async (req, res) => {
  try {
    const { username, email, role_id } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.role_id = role_id || user.role_id;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
