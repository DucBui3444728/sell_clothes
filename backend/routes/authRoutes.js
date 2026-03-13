const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/verify-email', authController.verifyEmail);
router.get('/verify-email/:token', authController.verifyEmailLink);

module.exports = router;
