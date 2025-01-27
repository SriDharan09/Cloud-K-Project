const { Review } = require('../models');

// Add a review for a specific menu item
exports.addReview = async (req, res) => {
  try {
    const { id } = req.user;
    const { MenuItemId, rating, comment } = req.body;

    const newReview = await Review.create({
      UserId : id,
      MenuItemId,
      rating,
      comment
    });

    res.json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.destroy();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all reviews for a specific menu item
exports.getMenuItemReviews = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const reviews = await Review.findAll({ where: { menuItemId } });

    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
