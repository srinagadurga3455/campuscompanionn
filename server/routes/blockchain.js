const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getStudentIdContract, getCertificateContract, getBadgeContract } = require('../config/blockchain');

// @route   GET /api/blockchain/student/:blockchainId
// @desc    Get student info from blockchain
// @access  Public
router.get('/student/:blockchainId', async (req, res) => {
  try {
    const contract = getStudentIdContract();
    const studentData = await contract.getStudent(req.params.blockchainId);

    res.json({
      success: true,
      student: {
        blockchainId: studentData.blockchainId,
        name: studentData.name,
        email: studentData.email,
        isActive: studentData.isActive,
        mintedAt: new Date(studentData.mintedAt.toNumber() * 1000)
      }
    });
  } catch (error) {
    console.error('Get blockchain student error:', error);
    res.status(500).json({ success: false, message: 'Error fetching blockchain data' });
  }
});

// @route   GET /api/blockchain/certificate/:tokenId
// @desc    Get certificate from blockchain
// @access  Public
router.get('/certificate/:tokenId', async (req, res) => {
  try {
    const contract = getCertificateContract();
    const certificateData = await contract.getCertificate(req.params.tokenId);

    res.json({
      success: true,
      certificate: {
        tokenId: req.params.tokenId,
        recipient: certificateData.recipient,
        title: certificateData.title,
        certificateType: certificateData.certificateType,
        isValid: certificateData.isValid,
        issuedAt: new Date(certificateData.issuedAt.toNumber() * 1000)
      }
    });
  } catch (error) {
    console.error('Get blockchain certificate error:', error);
    res.status(500).json({ success: false, message: 'Error fetching blockchain data' });
  }
});

// @route   GET /api/blockchain/badge/:tokenId
// @desc    Get badge from blockchain
// @access  Public
router.get('/badge/:tokenId', async (req, res) => {
  try {
    const contract = getBadgeContract();
    const badgeData = await contract.getBadge(req.params.tokenId);

    res.json({
      success: true,
      badge: {
        tokenId: req.params.tokenId,
        recipient: badgeData.recipient,
        name: badgeData.name,
        badgeType: badgeData.badgeType,
        issuedAt: new Date(badgeData.issuedAt.toNumber() * 1000)
      }
    });
  } catch (error) {
    console.error('Get blockchain badge error:', error);
    res.status(500).json({ success: false, message: 'Error fetching blockchain data' });
  }
});

// @route   POST /api/blockchain/verify/student/:blockchainId
// @desc    Verify student ID on blockchain
// @access  Public
router.post('/verify/student/:blockchainId', async (req, res) => {
  try {
    const contract = getStudentIdContract();
    const isValid = await contract.verifyStudentId(req.params.blockchainId);

    res.json({
      success: true,
      verified: isValid,
      blockchainId: req.params.blockchainId
    });
  } catch (error) {
    console.error('Verify student ID error:', error);
    res.status(500).json({ success: false, message: 'Error verifying blockchain data' });
  }
});

module.exports = router;
