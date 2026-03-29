const { ProductRating, User } = require('../models');

exports.getRatingsByProduct = async (req, res) => {
  try {
    const ratings = await ProductRating.findAll({
      where: { product_id: req.params.productId },
      include: [{ model: User, attributes: ['id', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving ratings' });
  }
};

exports.addRating = async (req, res) => {
  try {
    const { product_id, rating, review } = req.body;
    if (!product_id || !rating) return res.status(400).json({ message: 'Product ID and rating are required' });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });

    // Prevent multiple ratings from the same user on the same product (optional rule)
    const existing = await ProductRating.findOne({ where: { user_id: req.user.id, product_id } });
    if (existing) {
      existing.rating = rating;
      existing.review = review;
      await existing.save();
      return res.json(existing);
    }

    const newRating = await ProductRating.create({
      user_id: req.user.id,
      product_id,
      rating,
      review
    });
    res.status(201).json(newRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding rating' });
  }
};
