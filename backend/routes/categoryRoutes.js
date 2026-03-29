const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminAuth');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin routes
router.post('/', authMiddleware, isAdmin, upload.single('image'), categoryController.createCategory);
router.put('/:id', authMiddleware, isAdmin, upload.single('image'), categoryController.updateCategory);
router.delete('/:id', authMiddleware, isAdmin, categoryController.deleteCategory);

module.exports = router;
