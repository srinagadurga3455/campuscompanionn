const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleCheck');

// @route   POST /api/assignments
// @desc    Create new assignment
// @access  Private (faculty)
router.post('/', authMiddleware, roleMiddleware('faculty'), async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      department,
      year,
      section,
      dueDate,
      maxMarks,
      attachments
    } = req.body;

    const assignment = new Assignment({
      title,
      description,
      subject,
      faculty: req.user.id,
      department,
      year,
      section,
      dueDate,
      maxMarks,
      attachments
    });

    await assignment.save();

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/assignments
// @desc    Get assignments (filtered by user role)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'student') {
      // Students see assignments for their department and year
      filter = {
        department: req.user.department,
        year: req.user.year
      };
      if (req.user.classSection) {
        filter.$or = [
          { section: req.user.classSection },
          { section: null }
        ];
      }
    } else if (req.user.role === 'faculty') {
      // Faculty see assignments from their department only
      filter = {
        faculty: req.user.id,
        department: req.user.department
      };
    }

    const assignments = await Assignment.find(filter)
      .populate('faculty', 'name email')
      .populate('department', 'name')
      .sort({ dueDate: -1 });

    res.json({ success: true, assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get assignment by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('faculty', 'name email')
      .populate('department', 'name')
      .populate('submissions.student', 'name email blockchainId');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.json({ success: true, assignment });
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/assignments/:id/submit
// @desc    Submit assignment
// @access  Private (student)
router.post('/:id/submit', authMiddleware, roleMiddleware('student'), async (req, res) => {
  try {
    const { files } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      s => s.student.toString() === req.user.id
    );

    if (existingSubmission) {
      return res.status(400).json({ success: false, message: 'Assignment already submitted' });
    }

    // Check if late
    const isLate = new Date() > assignment.dueDate;

    // Add submission
    assignment.submissions.push({
      student: req.user.id,
      files,
      status: isLate ? 'late' : 'submitted',
      submittedAt: new Date()
    });

    await assignment.save();

    res.json({
      success: true,
      message: 'Assignment submitted successfully',
      assignment
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/assignments/:assignmentId/submissions/:submissionId/grade
// @desc    Grade assignment submission
// @access  Private (faculty)
router.put('/:assignmentId/submissions/:submissionId/grade', 
  authMiddleware, 
  roleMiddleware('faculty'), 
  async (req, res) => {
    try {
      const { marksObtained, feedback } = req.body;
      const assignment = await Assignment.findById(req.params.assignmentId);

      if (!assignment) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }

      // Check if faculty owns this assignment
      if (assignment.faculty.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const submission = assignment.submissions.id(req.params.submissionId);
      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      submission.marksObtained = marksObtained;
      submission.feedback = feedback;
      submission.status = 'graded';

      await assignment.save();

      res.json({
        success: true,
        message: 'Assignment graded successfully',
        submission
      });
    } catch (error) {
      console.error('Grade assignment error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route   DELETE /api/assignments/:id
// @desc    Delete assignment
// @access  Private (faculty who created it)
router.delete('/:id', authMiddleware, roleMiddleware('faculty'), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    if (assignment.faculty.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
