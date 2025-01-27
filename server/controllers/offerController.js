const { Offer } = require('../models');

// Create an offer
exports.createOffer = async (req, res) => {
  try {
    const { name, description, discount_percentage, valid_from, valid_to, min_order_amount } = req.body;

    const newOffer = await Offer.create({
      name,
      description,
      discount_percentage,
      valid_from,
      valid_to,
      min_order_amount
    });

    res.json(newOffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an offer
exports.updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, discount_percentage, valid_from, valid_to, min_order_amount } = req.body;

    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    offer.name = name;
    offer.description = description;
    offer.discount_percentage = discount_percentage;
    offer.valid_from = valid_from;
    offer.valid_to = valid_to;
    offer.min_order_amount = min_order_amount;

    await offer.save();

    res.json(offer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an offer
exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    await offer.destroy();

    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all offers
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll();

    res.json(offers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
