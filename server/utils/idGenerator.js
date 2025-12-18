const User = require('../models/User');

/**
 * Generate unique blockchain Student ID in format YYCCAAxxxx
 * YY = Last 2 digits of year of admission
 * CC = College code (configurable, default "01")
 * AA = Department/course code
 * xxxx = Sequential number
 */
const generateBlockchainId = async (yearOfAdmission, departmentCode) => {
  try {
    // Get last 2 digits of year
    const yearCode = String(yearOfAdmission).slice(-2);
    
    // College code (configurable)
    const collegeCode = process.env.COLLEGE_CODE || '01';
    
    // Department code (2 digits)
    const deptCode = String(departmentCode).padStart(2, '0');
    
    // Find the last student ID with this prefix
    const prefix = `${yearCode}${collegeCode}${deptCode}`;
    const lastUser = await User.findOne({
      blockchainId: new RegExp(`^${prefix}`)
    }).sort({ blockchainId: -1 });
    
    let sequentialNumber = 1;
    if (lastUser && lastUser.blockchainId) {
      const lastSequence = parseInt(lastUser.blockchainId.slice(-4));
      sequentialNumber = lastSequence + 1;
    }
    
    // Format: YYCCAAxxxx
    const blockchainId = `${prefix}${String(sequentialNumber).padStart(4, '0')}`;
    
    return blockchainId;
  } catch (error) {
    console.error('Error generating blockchain ID:', error);
    throw error;
  }
};

/**
 * Validate blockchain ID format
 */
const validateBlockchainId = (blockchainId) => {
  const regex = /^\d{10}$/;
  return regex.test(blockchainId);
};

module.exports = {
  generateBlockchainId,
  validateBlockchainId
};
