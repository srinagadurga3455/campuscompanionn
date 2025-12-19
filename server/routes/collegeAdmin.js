const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Club = require('../models/Club');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleCheck');

// @route   GET /api/college-admin/stats
// @desc    Get institutional stats
// @access  Private (college_admin)
router.get('/stats', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
    try {
        const [totalStudents, totalFaculty, totalClubs, pendingVerifications] = await Promise.all([
            User.countDocuments({ role: 'student', approvalStatus: 'approved' }),
            User.countDocuments({ role: 'faculty', approvalStatus: 'approved' }),
            Club.countDocuments({}),
            User.countDocuments({ approvalStatus: 'pending' })
        ]);

        res.json({
            success: true,
            stats: {
                totalStudents,
                totalFaculty,
                totalClubs,
                pendingVerifications
            }
        });
    } catch (error) {
        console.error('Get admin stats error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/college-admin/pending-users
// @desc    Proxy to get pending users (as expected by frontend)
// @access  Private (college_admin)
router.get('/pending-users', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
    try {
        const pendingUsers = await User.find({ approvalStatus: 'pending' })
            .select('-password')
            .populate('branch')
            .sort({ createdAt: -1 });

        res.json({ success: true, users: pendingUsers });
    } catch (error) {
        console.error('Get pending users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/college-admin/approve-user/:id
// @desc    Proxy to approve user
router.post('/approve-user/:id', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
    // This is a proxy to the existing PUT /api/users/:id/approve logic
    // For simplicity, we can just call the logic or redirect. 
    // Implementing it here to match the frontend POST expectation.
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.approvalStatus = 'approved';
        await user.save();

        res.json({ success: true, message: 'User approved' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/college-admin/reject-user/:id
router.post('/reject-user/:id', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.approvalStatus = 'rejected';
        await user.save();

        res.json({ success: true, message: 'User verification denied' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
