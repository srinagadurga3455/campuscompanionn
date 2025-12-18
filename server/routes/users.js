const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleCheck');
const { generateBlockchainId } = require('../utils/idGenerator');
const { sendApprovalEmail, sendRejectionEmail } = require('../utils/email');
const { getStudentIdContract } = require('../config/blockchain');

// @route   GET /api/users/students
// @desc    Get students (filtered by department for faculty)
// @access  Private (faculty, college_admin)
router.get('/students', authMiddleware, roleMiddleware('faculty', 'college_admin'), async (req, res) => {
  try {
    const filter = { role: 'student', approvalStatus: 'approved' };
    
    // Faculty can only see students from their department
    if (req.user.role === 'faculty' && req.user.department) {
      filter.department = req.user.department;
    }
    
    // Optional filters from query params
    if (req.query.department) filter.department = req.query.department;
    if (req.query.year) filter.year = parseInt(req.query.year);
    if (req.query.classSection) filter.classSection = req.query.classSection;

    const students = await User.find(filter)
      .select('-password')
      .populate('department', 'name code')
      .sort({ yearOfAdmission: -1, name: 1 });

    res.json({ success: true, students, count: students.length });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/pending
// @desc    Get all pending users (for admin approval)
// @access  Private (college_admin only)
router.get('/pending', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
  try {
    const pendingUsers = await User.find({ approvalStatus: 'pending' })
      .select('-password')
      .populate('department')
      .sort({ createdAt: -1 });

    res.json({ success: true, users: pendingUsers });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/approve
// @desc    Approve user and mint blockchain ID
// @access  Private (college_admin only)
router.put('/:id/approve', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('department');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.approvalStatus !== 'pending') {
      return res.status(400).json({ success: false, message: 'User is not pending approval' });
    }

    // Generate blockchain ID
    const departmentCode = user.department?.code || '00';
    const blockchainId = await generateBlockchainId(user.yearOfAdmission, departmentCode);

    // Mint Student ID on blockchain
    try {
      const studentIdContract = getStudentIdContract();
      const tx = await studentIdContract.mintStudentId(
        user._id.toString(),
        blockchainId,
        user.name,
        user.email
      );
      await tx.wait();
      console.log('Student ID minted on blockchain:', tx.hash);
    } catch (blockchainError) {
      console.error('Blockchain minting error:', blockchainError);
      // Continue with approval even if blockchain fails (can retry later)
    }

    // Update user
    user.approvalStatus = 'approved';
    user.blockchainId = blockchainId;
    await user.save();

    // Send email notification
    await sendApprovalEmail(user.email, user.name, blockchainId);

    res.json({
      success: true,
      message: 'User approved successfully',
      user: {
        id: user._id,
        name: user.name,
        blockchainId: user.blockchainId
      }
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/reject
// @desc    Reject user registration
// @access  Private (college_admin only)
router.put('/:id/reject', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.approvalStatus = 'rejected';
    await user.save();

    // Send email notification
    await sendRejectionEmail(user.email, user.name, reason);

    res.json({
      success: true,
      message: 'User rejected',
      user: {
        id: user._id,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users
// @desc    Get all users (with filters)
// @access  Private (admin/faculty)
router.get('/', authMiddleware, roleMiddleware('college_admin', 'faculty'), async (req, res) => {
  try {
    const { role, department, year, approvalStatus } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (department) filter.department = department;
    if (year) filter.year = year;
    if (approvalStatus) filter.approvalStatus = approvalStatus;

    const users = await User.find(filter)
      .select('-password')
      .populate('department')
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('department')
      .populate('eventsParticipated.event')
      .populate('certificates')
      .populate('badges');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Users can only update their own profile, unless they're admin
    if (req.user.id !== req.params.id && req.user.role !== 'college_admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { name, phone, profilePicture } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (profilePicture) updateFields.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
