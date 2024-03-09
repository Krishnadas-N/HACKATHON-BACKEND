// supportUtils.js

const SupportContact = require('../Models/supportScehma');

const getSupportContactInfo = async () => {
  try {
    const supportInfo = await SupportContact.findOne();
    return supportInfo;
  } catch (error) {
    console.error('Error retrieving support contact information:', error);
    throw error;
  }
};

module.exports = { getSupportContactInfo };
