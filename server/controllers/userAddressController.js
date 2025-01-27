const { UserAddress } = require('../models');

// Add a new address
exports.addAddress = async (req, res) => {
  try {
    const { id } = req.user; // Assuming you get userId from auth middleware
    console.log('User ID:', id); // Log user ID
    const { address, city, state, postalCode, country } = req.body;

    const newAddress = await UserAddress.create({
      UserId :id ,
      address,
      city,
      state,
      postal_code :postalCode ,
      country
    });

    res.json(newAddress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, city, state, postalCode, country } = req.body;

    const userAddress = await UserAddress.findByPk(id);
    if (!userAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    userAddress.address = address;
    userAddress.city = city;
    userAddress.state = state;
    userAddress.postalCode = postalCode;
    userAddress.country = country;

    await userAddress.save();

    res.json(userAddress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const userAddress = await UserAddress.findByPk(id);
    if (!userAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await userAddress.destroy();

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all addresses for a user
exports.getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    const addresses = await UserAddress.findAll({ where: { userId } });

    res.json(addresses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
