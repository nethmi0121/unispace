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
});

module.exports = mongoose.model("Room", roomSchema);