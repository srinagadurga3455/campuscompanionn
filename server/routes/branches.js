const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleCheck');

// @route   POST /api/branches
// @desc    Create new branch
// @access  Private (college_admin)
router.post('/', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
  try {
    const { name, code, department, description, hod } = req.body;

    const branch = new Branch({
      name,
      code,
      department,
      description,
      hod
    });

    await branch.save();

    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      branch
    });
  } catch (error) {
    console.error('Create branch error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Branch code already exists in this department' 
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/branches
// @desc    Get all branches (optionally filter by department)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { department } = req.query;
    
    const query = department ? { department } : {};
    
    const branches = await Branch.find(query)
      .populate('department', 'name code')
      .populate('hod', 'name email')
      .populate('faculty', 'name email')
      .sort({ name: 1 });

    res.json({ success: true, branches });
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/branches/:id
// @desc    Get branch by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id)
      .populate('department', 'name code')
      .populate('hod', 'name email')
      .populate('faculty', 'name email');

    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    res.json({ success: true, branch });
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/branches/:id
// @desc    Update branch
// @access  Private (college_admin)
router.put('/:id', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
  try {
    const { name, code, department, description, hod } = req.body;

    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      { name, code, department, description, hod },
      { new: true, runValidators: true }
    ).populate('department', 'name code');

    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    res.json({
      success: true,
      message: 'Branch updated successfully',
      branch
    });
  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/branches/:id
// @desc    Delete branch
// @access  Private (college_admin)
router.delete('/:id', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);

    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    res.json({
      success: true,
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
