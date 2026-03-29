const { CartItem, Product, ProductMedia } = require('../models');

exports.getCart = async (req, res) => {
  try {
    const cart = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [{ 
        model: Product,
        include: [{ model: ProductMedia, as: 'media' }]
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving cart' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity, size, color } = req.body;
    if (!product_id) return res.status(400).json({ message: 'Product ID is required' });

    // Check if same item (product+size+color) already exists
    const existing = await CartItem.findOne({ 
      where: { user_id: req.user.id, product_id, size: size || null, color: color || null } 
    });

    if (existing) {
      existing.quantity += (quantity || 1);
      await existing.save();
      return res.json(existing);
    }

    const cartItem = await CartItem.create({
      user_id: req.user.id,
      product_id,
      quantity: quantity || 1,
      size,
      color
    });
    
    res.status(201).json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    if (quantity < 1) {
      await item.destroy();
      return res.json({ message: 'Item removed from cart' });
    }

    item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const item = await CartItem.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    
    await item.destroy();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing from cart' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await CartItem.destroy({ where: { user_id: req.user.id } });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
};
