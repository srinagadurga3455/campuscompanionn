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

    // Faculty can only see students from their branch
    if (req.user.role === 'faculty' && req.user.branch) {
      filter.branch = req.user.branch;
    }

    // Optional filters from query params
    if (req.query.branch) filter.branch = req.query.branch;
    if (req.query.year) filter.year = parseInt(req.query.year);
    if (req.query.classSection) filter.classSection = req.query.classSection;

    console.log('Fetching students with filter:', filter);
    const students = await User.find(filter)
      .select('-password')
      .populate('branch', 'name code')
      .sort({ yearOfAdmission: -1, name: 1 });

    console.log(`Found ${students.length} students`);
    res.json({ success: true, students, count: students.length });
  } catch (error) {
    console.error('Get students error:', error);
    console.error('Error message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/users/pending
// @desc    Get all pending users (for admin approval)
// @access  Private (college_admin only)
router.get('/pending', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
  try {
    console.log('Fetching pending users...');
    const pendingUsers = await User.find({ approvalStatus: 'pending' })
      .select('-password')
      .populate('branch')
      .sort({ createdAt: -1 });

    console.log(`Found ${pendingUsers.length} pending users`);
    res.json({ success: true, users: pendingUsers });
  } catch (error) {
    console.error('Get pending users error:', error);
    console.error('Error message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/users/:id/approve
// @desc    Approve user and mint blockchain ID (students) or generate teacher code (faculty)
// @access  Private (college_admin only)
router.put('/:id/approve', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('branch');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.approvalStatus !== 'pending') {
      return res.status(400).json({ success: false, message: 'User is not pending approval' });
    }

    // Handle based on role
    if (user.role === 'student') {
      // Generate blockchain ID for students
      const branchCode = user.branch?.code || '00';
      const blockchainId = await generateBlockchainId(user.yearOfAdmission, branchCode);

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

      user.blockchainId = blockchainId;

    } else if (user.role === 'faculty') {
      // Generate teacher code for faculty
      const year = new Date().getFullYear().toString().slice(-2);
      const branchCode = user.branch?.code || 'GEN';
      let teacherCode;
      let isUnique = false;

      while (!isUnique) {
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        teacherCode = `TC${year}${branchCode}${random}`;

        const existing = await User.findOne({ teacherCode });
        if (!existing) isUnique = true;
      }

      user.teacherCode = teacherCode;
    }

    // Update user approval status
    user.approvalStatus = 'approved';
    await user.save();

    // Send email notification
    if (user.role === 'student') {
      await sendApprovalEmail(user.email, user.name, user.blockchainId);
    } else if (user.role === 'faculty') {
      await sendApprovalEmail(user.email, user.name, user.teacherCode);
    }

    res.json({
      success: true,
      message: `${user.role === 'faculty' ? 'Faculty' : 'User'} approved successfully`,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        blockchainId: user.blockchainId,
        teacherCode: user.teacherCode
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
    const { role, branch, year, approvalStatus } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (branch) filter.branch = branch;
    if (year) filter.year = year;
    if (approvalStatus) filter.approvalStatus = approvalStatus;

    console.log('Fetching users with filter:', filter);

    const users = await User.find(filter)
      .select('-password')
      .populate('branch')
      .sort({ createdAt: -1 });

    console.log(`Found ${users.length} users`);
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('branch')
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

// @route   POST /api/users/generate-teacher-code
// @desc    Generate or regenerate teacher code for faculty
// @access  Private (faculty, college_admin)
router.post('/generate-teacher-code', authMiddleware, roleMiddleware('faculty', 'college_admin'), async (req, res) => {
  try {
    const userId = req.user.role === 'faculty' ? req.user.id : req.body.facultyId;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Faculty ID required' });
    }

    const faculty = await User.findById(userId);

    if (!faculty || faculty.role !== 'faculty') {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    // Generate unique teacher code: TCYYBRANCH### (TC + Year + Branch + Random)
    const year = new Date().getFullYear().toString().slice(-2);
    const branchCode = faculty.branch ? (await faculty.populate('branch')).branch.code : 'GEN';
    let teacherCode;
    let isUnique = false;

    while (!isUnique) {
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      teacherCode = `TC${year}${branchCode}${random}`;

      const existing = await User.findOne({ teacherCode });
      if (!existing) isUnique = true;
    }

    faculty.teacherCode = teacherCode;
    await faculty.save();

    res.json({
      success: true,
      message: 'Teacher code generated successfully',
      teacherCode
    });
  } catch (error) {
    console.error('Generate teacher code error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
