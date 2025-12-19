const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleCheck');
const { sendEventNotificationEmail } = require('../utils/email');

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
      images,
      participationType,
      teamSize,
      registrationFee,
      paymentLink
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
      images,
      participationType,
      teamSize,
      registrationFee,
      paymentLink,
      // College admins can auto-approve their events, club admins need approval
      approvalStatus: req.user.role === 'college_admin' ? 'approved' : 'pending'
    });

    await event.save();

    await event.populate('organizer', 'name email');
    await event.populate('club', 'name');

    res.status(201).json({
      success: true,
      message: req.user.role === 'college_admin'
        ? 'Event created and approved successfully'
        : 'Event created successfully. Waiting for admin approval.',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/events
// @desc    Get all events (with filters)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { eventType, status, club, department, upcoming, approvalStatus } = req.query;
    const filter = {};

    if (eventType) filter.eventType = eventType;
    if (status) filter.status = status;
    if (club) filter.club = club;
    if (department) filter.department = department;
    if (approvalStatus) filter.approvalStatus = approvalStatus;

    // Filter by approval status based on user role
    if (req.user.role === 'student' || req.user.role === 'faculty') {
      // Students and faculty only see approved events
      filter.approvalStatus = 'approved';
    } else if (req.user.role === 'club_admin') {
      // Club admins see their own events (all statuses)
      filter.organizer = req.user.id;
    }
    // College admins see all events (no approval filter)

    // Filter by authenticated user's department if they're student or faculty
    if (req.user && (req.user.role === 'student' || req.user.role === 'faculty')) {
      if (req.user.department) {
        filter.$or = [
          { department: req.user.department },
          { department: null }, // College-wide events
          { eventType: 'college' } // College events visible to all
        ];
      }
    }

    if (upcoming === 'true') {
      filter.startDate = { $gte: new Date() };
      filter.status = 'upcoming';
    }

    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .populate('club', 'name')
      .populate('department', 'name')
      .populate('participants', 'name email blockchainId')
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

    // Check if payment is pending
    const existingPending = event.pendingRegistrations?.find(
      p => p.user.toString() === req.user.id
    );

    if (existingPending) {
      return res.json({
        success: true,
        message: 'Payment pending',
        paymentRequired: true,
        event
      });
    }

    // Check max participants
    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    // Check registration deadline
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed' });
    }

    // Handle Team Registration
    if (event.participationType === 'team') {
      const { teamName, members } = req.body;

      if (!teamName || !members) {
        return res.status(400).json({ success: false, message: 'Team details are required' });
      }

      // Validate team size (excluding leader) -> Total size = members.length + 1 (leader)
      // Check if teamSize is defined, otherwise default to 1-1
      const minSize = event.teamSize?.min || 1;
      const maxSize = event.teamSize?.max || 1;

      // We assume 'members' contains the team mates. Total team size = 1 (leader) + members.length
      const totalTeamSize = 1 + (Array.isArray(members) ? members.length : 0);

      if (totalTeamSize < minSize || totalTeamSize > maxSize) {
        return res.status(400).json({
          success: false,
          message: `Team size must be between ${minSize} and ${maxSize} members (including you)`
        });
      }

      // Add to teamRegistrations
      event.teamRegistrations.push({
        leader: req.user.id,
        teamName,
        members
      });
    }

    // Add participant (Leader is the main participant)
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

// @route   PUT /api/events/:id/approve
// @desc    Approve or reject event
// @access  Private (college_admin)
router.put('/:id/approve', authMiddleware, roleMiddleware('college_admin'), async (req, res) => {
  try {
    const { approvalStatus } = req.body;

    if (!['approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid approval status' });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { approvalStatus },
      { new: true }
    ).populate('organizer', 'name email')
      .populate('club', 'name');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // If event is approved, send notification to all students
    if (approvalStatus === 'approved') {
      try {
        // Get all approved students
        const students = await User.find({
          role: 'student',
          approvalStatus: 'approved',
          emailVerified: true
        }).select('email name');

        console.log(`📧 Sending event notification emails to ${students.length} students`);

        // Send notifications to all students (in background, don't wait)
        const emailPromises = students.map(student => {
          if (student.email) {
            return sendEventNotificationEmail(student.email, student.name, {
              title: event.title,
              eventType: event.eventType,
              startDate: event.startDate,
              venue: event.venue,
              club: event.club,
              maxParticipants: event.maxParticipants,
              registrationDeadline: event.registrationDeadline
            }).catch(err => {
              console.error(`Failed to send notification to ${student.name}:`, err);
              return { success: false, email: student.email };
            });
          }
          return Promise.resolve({ success: false, email: student.email });
        });

        // Wait for all emails to be sent (or attempted)
        Promise.all(emailPromises).then(results => {
          const successCount = results.filter(r => r.success).length;
          console.log(`✅ Event notification emails sent: ${successCount}/${students.length} successful`);
        });

      } catch (notificationError) {
        // Log error but don't fail the approval
        console.error('Error sending notifications:', notificationError);
      }
    }

    res.json({
      success: true,
      message: `Event ${approvalStatus} successfully${approvalStatus === 'approved' ? ' and notifications sent to students' : ''}`,
      event
    });
  } catch (error) {
    console.error('Approve event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
