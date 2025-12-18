const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badgeType: {
    type: String,
    enum: ['skill', 'achievement', 'milestone', 'leadership', 'participation'],
    required: true
  },
  criteria: {
    type: String
  },
  issuer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  imageUrl: {
    type: String
  },
  issuedDate: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Badge', badgeSchema);
