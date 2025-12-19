const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleCheck');

// @route   POST /api/enrollments/join
// @desc    Student joins a teacher's class using teacher code
// @access  Private (student)
router.post('/join', authMiddleware, roleMiddleware('student'), async (req, res) => {
  try {
    const { teacherCode, subject, classSection } = req.body;

    // Find faculty by teacher code
    const faculty = await User.findOne({ teacherCode, role: 'faculty' });
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Invalid teacher code' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      faculty: faculty._id,
      teacherCode,
      status: 'active'
    });

    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this class' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: req.user.id,
      faculty: faculty._id,
      teacherCode,
      subject: subject || 'General',
      classSection: classSection || 'A'
    });

    await enrollment.save();

    await enrollment.populate('faculty', 'name email department');

    res.status(201).json({
      success: true,
      message: `Successfully enrolled in ${faculty.name}'s class`,
      enrollment
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   GET /api/enrollments/my-classes
// @desc    Get student's enrolled classes or faculty's enrolled students
// @access  Private
router.get('/my-classes', authMiddleware, async (req, res) => {
  try {
    let enrollments;

    if (req.user.role === 'student') {
      enrollments = await Enrollment.find({
        student: req.user.id,
        status: 'active'
      }).populate('faculty', 'name email branch teacherCode');
    } else if (req.user.role === 'faculty') {
      enrollments = await Enrollment.find({
        faculty: req.user.id,
        status: 'active'
      }).populate({
        path: 'student',
        select: 'name email year blockchainId branch',
        populate: {
          path: 'branch',
          select: 'name code'
        }
      });
    }

    res.json({ success: true, enrollments });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/enrollments/:id
// @desc    Drop a class (student) or remove a student (faculty)
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    // Check authorization
    if (
      req.user.id !== enrollment.student.toString() &&
      req.user.id !== enrollment.faculty.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    enrollment.status = 'dropped';
    await enrollment.save();

    res.json({ success: true, message: 'Class dropped successfully' });
  } catch (error) {
    console.error('Drop class error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/enrollments/students-by-code/:teacherCode
// @desc    Get all students enrolled with a specific teacher code (for faculty)
// @access  Private (faculty)
router.get('/students-by-code/:teacherCode', authMiddleware, roleMiddleware('faculty'), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      faculty: req.user.id,
      teacherCode: req.params.teacherCode,
      status: 'active'
    }).populate('student', 'name email year blockchainId');

    const students = enrollments.map(e => ({
      ...e.student.toObject(),
      enrollmentId: e._id,
      subject: e.subject,
      classSection: e.classSection,
      enrolledAt: e.enrolledAt
    }));

    res.json({ success: true, students, count: students.length });
  } catch (error) {
    console.error('Get students by code error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
