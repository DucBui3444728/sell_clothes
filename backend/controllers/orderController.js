const { Order, OrderItem, User, Product } = require('../models');

// GET all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'full_name'] },
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'image'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// GET user orders (Logged in user)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'image'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('getMyOrders error:', error);
    res.status(500).json({ message: 'Server error fetching your orders' });
  }
};

// PUT update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating order status' });
  }
};
