const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherCode: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  classSection: {
    type: String,
    default: 'A'
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'dropped'],
    default: 'active'
  }
});

// Compound index to ensure a student can't enroll in the same teacher's class twice
enrollmentSchema.index({ student: 1, faculty: 1, teacherCode: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
