const { User } = require('../models');

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    // req.user is set in authMiddleware
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'refresh_token', 'email_verification_token'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/users/profile
// @desc    Update user profile and avatar
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, dob, phone, gender } = req.body;
    
    // Find the user
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update text fields
    if (full_name !== undefined) user.full_name = full_name;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    
    // Format dob to Date if provided, or set to null
    if (dob !== undefined) {
      user.dob = dob ? new Date(dob) : null;
    }

    // Update avatar if file is uploaded
    if (req.file) {
      // Create a relative path accessible by frontend
      // Assuming server runs on localhost:5000 and static is served from /uploads
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();

    // Re-fetch user to exclude excluded attributes
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'refresh_token', 'email_verification_token'] }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    if (error.message === 'Only image files are allowed!') {
       return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error updating profile' });
  }
};
