const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'club_admin', 'college_admin'],
    default: 'student'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  blockchainId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  teacherCode: {
    type: String,
    unique: true,
    sparse: true // Only for faculty, unique per teacher
  },
  phone: {
    type: String,
    required: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: false
  },
  year: {
    type: Number,
    min: 1,
    max: 4
  },
  yearOfAdmission: {
    type: Number
  },
  classSection: {
    type: String
  },
  rollNumber: {
    type: String
  },
  clubsManaged: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club'
  }],
  eventsParticipated: [{
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    participatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  certificates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  }],
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  }],
  profilePicture: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
