const mongoose = require('mongoose');

const UsageLogSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true
  },
  actionType: {
    type: String,
    enum: ['check-in', 'check-out'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UsageLog', UsageLogSchema);