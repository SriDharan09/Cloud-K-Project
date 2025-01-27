const { Customization } = require('../models');

const getPasswordPolicies = async () => {
  try {
    const policy = await Customization.findOne({
      order: [['updatedAt', 'DESC']]
    });
    return policy || {};
  } catch (error) {
    throw new Error('Error fetching password policies');
  }
};

module.exports = getPasswordPolicies;
