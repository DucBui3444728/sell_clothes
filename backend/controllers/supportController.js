const { SupportTicket, User } = require('../models');

// GET all support tickets (Admin only)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'full_name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching support tickets' });
  }
};

// POST create ticket (Logged in user)
exports.createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const ticket = await SupportTicket.create({
      user_id: req.user.id,
      subject,
      message
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating support ticket' });
  }
};

// PUT reply and update status (Admin only)
exports.replyToTicket = async (req, res) => {
  try {
    const { status, reply } = req.body;
    const ticket = await SupportTicket.findByPk(req.params.id);

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (status) ticket.status = status;
    if (reply) ticket.reply = reply;

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating ticket' });
  }
};
