const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
  },

  location: {
    type: String,
    required: true,
  },

  capacity: {
    type: Number,
    required: true,
    min: 0,
  },

  currentCount: {
    type: Number,
    default: 0,
  },

  checkedInStudents: [{
    type: mongoose.Schema.Types.Mixed // 👈 Supports both ObjectIds and custom Student ID strings!
  }]
});

module.exports = mongoose.model("Room", roomSchema);