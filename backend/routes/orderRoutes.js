const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminAuth');

// User routes
router.get('/my-orders', authMiddleware, orderController.getMyOrders);

// Admin routes
router.get('/', authMiddleware, isAdmin, orderController.getAllOrders);
router.put('/:id/status', authMiddleware, isAdmin, orderController.updateOrderStatus);

module.exports = router;
