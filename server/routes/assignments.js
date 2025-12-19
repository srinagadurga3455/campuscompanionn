const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Assignment = require('../models/Assignment');
const Enrollment = require('../models/Enrollment');
const Branch = require('../models/Branch');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleCheck');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/assignments');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'assignment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept PDFs only
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// @route   POST /api/assignments
// @desc    Create new assignment
// @access  Private (faculty)
router.post('/', authMiddleware, roleMiddleware('faculty'), upload.single('pdfFile'), async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      year,
      totalMarks,
      teacherCode,
      department,
      section
    } = req.body;

    console.log('📝 Creating assignment with data:', {
      title,
      subject,
      year,
      department,
      section,
      totalMarks
    });

    // Validate that teacher has this code
    if (!req.user.teacherCode) {
      return res.status(400).json({ success: false, message: 'You need a teacher code first. Please contact admin.' });
    }

    const codeToUse = teacherCode || req.user.teacherCode;

    // Find branch by code (case-insensitive)
    let branchId;
    if (department) {
      console.log('🔍 Looking up branch with code:', department);
      const branch = await Branch.findOne({ code: department.toUpperCase() });
      if (!branch) {
        console.log('❌ Branch not found:', department);
        return res.status(400).json({ success: false, message: `Invalid branch code: ${department}` });
      }
      console.log('✅ Branch found:', branch.name);
      branchId = branch._id;
    } else {
      branchId = req.user.branch;
    }

    const attachments = [];
    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        url: `/uploads/assignments/${req.file.filename}`
      });
    }

    const assignment = new Assignment({
      title,
      description,
      subject,
      faculty: req.user.id,
      teacherCode: codeToUse,
      branch: branchId,
      section: section || '',
      year: Number(year),
      dueDate: req.body.dueDate,
      maxMarks: Number(totalMarks),
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
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   GET /api/assignments
// @desc    Get assignments (filtered by enrollment)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    let assignments = [];

    if (req.user.role === 'student') {
      // Get all enrollments for this student
      const enrollments = await Enrollment.find({
        student: req.user.id,
        status: 'active'
      });

      // Get teacher codes student is enrolled in
      const teacherCodes = enrollments.map(e => e.teacherCode);

      // Get assignments from enrolled teachers AND matching student's branch, year, and section
      const studentUser = await req.user.populate('branch');
      
      assignments = await Assignment.find({
        teacherCode: { $in: teacherCodes },
        branch: req.user.branch,
        year: req.user.year,
        $or: [
          { section: req.user.classSection },
          { section: { $exists: false } },
          { section: '' }
        ]
      })
        .populate('faculty', 'name email teacherCode')
        .populate('branch', 'name code')
        .populate('submissions.student', 'name')
        .sort({ dueDate: -1 });

    } else if (req.user.role === 'faculty') {
      // Faculty see their own assignments
      assignments = await Assignment.find({
        faculty: req.user.id
      })
        .populate('faculty', 'name email')
        .populate('branch', 'name code')
        .populate('submissions.student', 'name email blockchainId')
        .sort({ dueDate: -1 });
    }

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
