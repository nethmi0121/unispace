const mongoose = require('mongoose');

const UsageLogSchema = new mongoose.Schema({
  // Links the log to a specific room ID
  roomName: {
    type: String,
    required: true
  },
  // Tracks the type of action taken
  actionType: {
    type: String,
    enum: ['check-in', 'check-out'],
    required: true
  },
  // Automatically records the exact date and time of the event
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UsageLog', UsageLogSchema);