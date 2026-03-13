const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Use authMiddleware for all routes beneath this
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', upload.single('avatar'), userController.updateProfile);

module.exports = router;
