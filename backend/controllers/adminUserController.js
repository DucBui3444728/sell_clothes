const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();
    
    // exclude password
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
};
