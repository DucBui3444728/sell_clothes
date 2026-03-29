const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminUserController = require('../controllers/adminUserController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminAuth');
const upload = require('../middleware/uploadMiddleware');

// Use authMiddleware for all routes beneath this
router.use(authMiddleware);

// Normal user routes
router.get('/profile', userController.getProfile);
router.put('/profile', upload.single('avatar'), userController.updateProfile);

// Admin routes
router.get('/', isAdmin, adminUserController.getAllUsers);
router.put('/:id/role', isAdmin, adminUserController.updateUserRole);
router.delete('/:id', isAdmin, adminUserController.deleteUser);

module.exports = router;
