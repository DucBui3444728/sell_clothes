const { Address } = require('../models');

// @route   GET /api/addresses
// @desc    Get all addresses for a user
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.user.id },
      order: [['is_default', 'DESC'], ['createdAt', 'DESC']]
    });
    res.json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/addresses
// @desc    Create a new address
exports.createAddress = async (req, res) => {
  try {
    const { phone, detailed_address, street, city, state, country, is_default } = req.body;
    
    // Check existing addresses
    const count = await Address.count({ where: { user_id: req.user.id } });
    
    // If it's the first address, or if explicitly setting default
    const shouldBeDefault = count === 0 || is_default;

    if (shouldBeDefault) {
      // Unset any existing default address
      await Address.update({ is_default: false }, { where: { user_id: req.user.id } });
    }

    const newAddress = await Address.create({
      user_id: req.user.id,
      phone,
      detailed_address,
      street,
      city,
      state,
      country,
      is_default: shouldBeDefault
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/addresses/:id
// @desc    Update an address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, detailed_address, street, city, state, country, is_default } = req.body;

    const address = await Address.findOne({ where: { id, user_id: req.user.id } });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (is_default) {
      // Unset other defaults
      await Address.update({ is_default: false }, { where: { user_id: req.user.id } });
    }

    address.phone = phone !== undefined ? phone : address.phone;
    address.detailed_address = detailed_address !== undefined ? detailed_address : address.detailed_address;
    address.street = street !== undefined ? street : address.street;
    address.city = city !== undefined ? city : address.city;
    address.state = state !== undefined ? state : address.state;
    address.country = country !== undefined ? country : address.country;
    address.is_default = is_default !== undefined ? is_default : address.is_default;

    await address.save();
    res.json(address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   DELETE /api/addresses/:id
// @desc    Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({ where: { id, user_id: req.user.id } });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const count = await Address.count({ where: { user_id: req.user.id } });
    if (count <= 1) {
      return res.status(400).json({ message: 'You must have at least one address.' });
    }

    const wasDefault = address.is_default;
    await address.destroy();

    // If the deleted address was default, make the most recently created one the new default
    if (wasDefault) {
      const latestAddress = await Address.findOne({
        where: { user_id: req.user.id },
        order: [['createdAt', 'DESC']]
      });
      if (latestAddress) {
        latestAddress.is_default = true;
        await latestAddress.save();
      }
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
