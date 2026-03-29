const { User } = require('../models');

// isAdmin middleware assumes authMiddleware has already run and attached req.user
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized. User not authenticated.' });
    }

    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized. User not found.' });
    }

    if (user.role !== 'admin' && user.role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden. Admin or Manager role required.' });
    }

    // Pass role to next middleware if needed
    req.user.role = user.role;
    next();
  } catch (error) {
    console.error('isAdmin middleware error:', error);
    res.status(500).json({ message: 'Server error authorizing admin access' });
  }
};

module.exports = { isAdmin };
