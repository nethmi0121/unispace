const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Please provide a student ID number'],
    trim: true
  },
  studentName: {
    type: String,
    required: [true, 'Please provide the student name']
  },
  actionType: {
    type: String,
    enum: ['CHECK_IN', 'CHECK_OUT'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  locationHub: {
    type: String,
    default: 'Main Study Lounge'
  }
});

module.exports = mongoose.model('Log', LogSchema);