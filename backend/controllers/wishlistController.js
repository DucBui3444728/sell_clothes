const { Wishlist, Product } = require('../models');

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product }]
    });
    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving wishlist' });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ message: 'Product ID is required' });

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ where: { user_id: req.user.id, product_id } });
    if (existing) {
      return res.status(400).json({ message: 'Product is already in wishlist' });
    }

    const wishlistItem = await Wishlist.create({
      user_id: req.user.id,
      product_id
    });
    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding to wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Wishlist item not found' });
    
    await item.destroy();
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing from wishlist' });
  }
};
