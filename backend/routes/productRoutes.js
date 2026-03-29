const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminAuth');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', authMiddleware, isAdmin, upload.array('media', 10), productController.createProduct);
router.put('/:id', authMiddleware, isAdmin, upload.array('media', 10), productController.updateProduct);
router.delete('/:id', authMiddleware, isAdmin, productController.deleteProduct);
router.delete('/media/:mediaId', authMiddleware, isAdmin, productController.deleteProductMedia);

module.exports = router;
