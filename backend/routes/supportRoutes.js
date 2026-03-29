const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminAuth');

// User routes
router.post('/', authMiddleware, supportController.createTicket);

// Admin routes
router.get('/', authMiddleware, isAdmin, supportController.getAllTickets);
router.put('/:id/reply', authMiddleware, isAdmin, supportController.replyToTicket);

module.exports = router;
