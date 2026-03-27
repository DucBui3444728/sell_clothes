const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendVerificationEmail } = require('../utils/sendEmail');

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      full_name,
      phone
    });

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    newUser.email_verification_token = otpCode;
    await newUser.save();

    // Send the verification email
    const hostUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    await sendVerificationEmail(newUser.email, otpCode, hostUrl);

    res.status(201).json({
      message: 'User registered successfully. Please check your email for the verification code.',
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.is_email_verified) {
      return res.status(401).json({ message: 'Please verify your email address before logging in.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token to DB
    user.refresh_token = refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      // Check if user exists and token matches the one in DB
      const user = await User.findByPk(decoded.id);
      if (!user || user.refresh_token !== refresh_token) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      // Generate new tokens
      const tokens = generateTokens(user);

      // Save new refresh token to DB
      user.refresh_token = tokens.refreshToken;
      await user.save();

      res.json({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body; // Can be from click link (params) or OTP form input (body)

    if (!token) {
      return res.status(400).json({ message: 'Verification code is required.' });
    }

    // Find the user with that token
    const user = await User.findOne({ where: { email_verification_token: token } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }

    // Update user: Set as verified and clear the token
    user.is_email_verified = true;
    user.email_verification_token = null;
    user.email_verified_at = new Date();
    await user.save();

    res.json({ message: 'Email verified successfully! You can now login.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

exports.verifyEmailLink = (req, res) => {
  // If user clicks the link randomly from email, we can either:
  // 1. Call logic directly
  // 2. Redirect to frontend with token in query params
  req.body.token = req.params.token;
  return exports.verifyEmail(req, res);
};
