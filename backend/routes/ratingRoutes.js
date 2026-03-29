const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/product/:productId', ratingController.getRatingsByProduct);
router.post('/', authMiddleware, ratingController.addRating);

module.exports = router;
