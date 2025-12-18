const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleCheck');
const { getBadgeContract } = require('../config/blockchain');

// @route   POST /api/badges
// @desc    Issue a badge
// @access  Private (club_admin, college_admin)
router.post('/', authMiddleware, roleMiddleware('club_admin', 'college_admin'), async (req, res) => {
  try {
    const {
      name,
      description,
      recipient,
      badgeType,
      criteria,
      imageUrl,
      metadata
    } = req.body;

    // Get recipient details
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    // Create badge in database
    const badge = new Badge({
      name,
      description,
      recipient,
      badgeType,
      criteria,
      issuer: req.user.id,
      imageUrl,
      metadata
    });

    await badge.save();

    // Mint badge on blockchain
    try {
      const badgeContract = getBadgeContract();
      if (badgeContract) {
        const tx = await badgeContract.issueBadge(
          recipientUser.blockchainId,
          name,
          badgeType,
          imageUrl || ''
        );
        const receipt = await tx.wait();

        // Get token ID from event logs
        const tokenId = receipt.logs[0].topics[3];

        badge.blockchainTxHash = tx.hash;
        badge.blockchainTokenId = parseInt(tokenId, 16);
        await badge.save();
      } else {
        console.log('Badge contract not deployed - stored in database only');
      }

      console.log('Badge minted on blockchain:', tx.hash);
    } catch (blockchainError) {
      console.error('Blockchain minting error:', blockchainError);
    }

    // Add badge to user
    await User.findByIdAndUpdate(recipient, {
      $push: { badges: badge._id }
    });

    res.status(201).json({
      success: true,
      message: 'Badge issued successfully',
      badge
    });
  } catch (error) {
    console.error('Issue badge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/badges
// @desc    Get badges (filtered by user)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'student') {
      filter.recipient = req.user.id;
    } else if (req.query.recipient) {
      filter.recipient = req.query.recipient;
    }

    const badges = await Badge.find(filter)
      .populate('recipient', 'name email blockchainId')
      .populate('issuer', 'name email')
      .sort({ issuedDate: -1 });

    res.json({ success: true, badges });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/badges/:id
// @desc    Get badge by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id)
      .populate('recipient', 'name email blockchainId')
      .populate('issuer', 'name email');

    if (!badge) {
      return res.status(404).json({ success: false, message: 'Badge not found' });
    }

    res.json({ success: true, badge });
  } catch (error) {
    console.error('Get badge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
