const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  issuer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  certificateType: {
    type: String,
    enum: ['participation', 'achievement', 'completion', 'award'],
    required: true
  },
  blockchainTxHash: {
    type: String,
    unique: true,
    sparse: true
  },
  blockchainTokenId: {
    type: Number
  },
  ipfsHash: {
    type: String
  },
  issuedDate: {
    type: Date,
    default: Date.now
  },
  verificationUrl: {
    type: String
  },
  certificateFile: {
    type: String  // Path to uploaded certificate file
  },
  fileType: {
    type: String,
    enum: ['pdf', 'png', 'jpg', 'jpeg']
  },
  metadata: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isClaimed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Certificate', certificateSchema);
