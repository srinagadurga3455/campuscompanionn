const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleCheck');

// @route   POST /api/clubs
// @desc    Create new club
// @access  Private (college_admin)
router.post('/', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
  try {
    const { name, description, category, admin, logo, socialLinks } = req.body;

    const club = new Club({
      name,
      description,
      category,
      admin,
      logo,
      socialLinks
    });

    await club.save();

    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      club
    });
  } catch (error) {
    console.error('Create club error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/clubs
// @desc    Get all clubs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const clubs = await Club.find(filter)
      .populate('admin', 'name email')
      .populate('members.user', 'name email')
      .sort({ name: 1 });

    res.json({ success: true, clubs });
  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/clubs/my-club
// @desc    Get club managed by current user
// @access  Private (club_admin)
router.get('/my-club', authMiddleware, roleMiddleware('club_admin'), async (req, res) => {
  try {
    const club = await Club.findOne({ admin: req.user.id })
      .populate('admin', 'name email')
      .populate('members.user', 'name email blockchainId')
      .populate('events');

    if (!club) {
      return res.status(404).json({ success: false, message: 'No club found for this admin' });
    }

    res.json({ success: true, club });
  } catch (error) {
    console.error('Get my club error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// @route   GET /api/clubs/:id
// @desc    Get club by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members.user', 'name email blockchainId')
      .populate('events');

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    res.json({ success: true, club });
  } catch (error) {
    console.error('Get club error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/clubs/:id/join
// @desc    Join a club
// @access  Private (student)
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    // Check if already a member
    const isMember = club.members.some(
      m => m.user.toString() === req.user.id
    );

    if (isMember) {
      return res.status(400).json({ success: false, message: 'Already a member of this club' });
    }

    club.members.push({
      user: req.user.id,
      role: 'member',
      joinedAt: new Date()
    });

    await club.save();

    res.json({
      success: true,
      message: 'Successfully joined the club',
      club
    });
  } catch (error) {
    console.error('Join club error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/clubs/:id/leave
// @desc    Leave a club
// @access  Private
router.post('/:id/leave', authMiddleware, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    club.members = club.members.filter(
      m => m.user.toString() !== req.user.id
    );

    await club.save();

    res.json({
      success: true,
      message: 'Successfully left the club'
    });
  } catch (error) {
    console.error('Leave club error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
