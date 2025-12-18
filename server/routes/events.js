const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleCheck');

// @route   POST /api/events
// @desc    Create new event
// @access  Private (club_admin, college_admin)
router.post('/', authMiddleware, roleMiddleware('club_admin', 'college_admin'), async (req, res) => {
  try {
    const {
      title,
      description,
      eventType,
      club,
      department,
      startDate,
      endDate,
      venue,
      maxParticipants,
      registrationDeadline,
      images
    } = req.body;

    const event = new Event({
      title,
      description,
      eventType,
      organizer: req.user.id,
      club,
      department,
      startDate,
      endDate,
      venue,
      maxParticipants,
      registrationDeadline,
      images
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/events
// @desc    Get all events (with filters)
// @access  Public (with auth for personalized data)
router.get('/', async (req, res) => {
  try {
    const { eventType, status, club, department, upcoming } = req.query;
    const filter = {};

    if (eventType) filter.eventType = eventType;
    if (status) filter.status = status;
    if (club) filter.club = club;
    if (department) filter.department = department;
    if (upcoming === 'true') {
      filter.startDate = { $gte: new Date() };
      filter.status = 'upcoming';
    }

    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .populate('club', 'name')
      .populate('department', 'name')
      .sort({ startDate: 1 });

    res.json({ success: true, events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('club', 'name logo')
      .populate('department', 'name')
      .populate('participants', 'name email blockchainId');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (organizer, college_admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check authorization
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'college_admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (organizer, college_admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check authorization
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'college_admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for event
// @access  Private (student)
router.post('/:id/register', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if already registered
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Already registered for this event' });
    }

    // Check max participants
    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    // Check registration deadline
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed' });
    }

    // Add participant
    event.participants.push(req.user.id);
    await event.save();

    // Add to user's participated events
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        eventsParticipated: {
          event: event._id,
          participatedAt: new Date()
        }
      }
    });

    res.json({
      success: true,
      message: 'Successfully registered for event',
      event
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/events/:id/unregister
// @desc    Unregister from event
// @access  Private (student)
router.post('/:id/unregister', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Remove participant
    event.participants = event.participants.filter(
      p => p.toString() !== req.user.id
    );
    await event.save();

    // Remove from user's participated events
    await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        eventsParticipated: { event: event._id }
      }
    });

    res.json({
      success: true,
      message: 'Successfully unregistered from event'
    });
  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
