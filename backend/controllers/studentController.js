const roomModel = require('../models/roomModel');

// @desc    Get all rooms
// @route   GET /api/rooms
const getRooms = (req, res) => {
  const rooms = roomModel.getAllRooms();
  res.json(rooms);
};

// @desc    Check-in: +1 occupancy
// @route   POST /api/rooms/:id/checkin
const checkInRoom = (req, res) => {
  const roomId = parseInt(req.params.id);
  const room = roomModel.findRoomById(roomId);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (room.currentOccupancy >= room.capacity) {
    return res.status(400).json({ error: 'Room is full!' });
  }

  room.currentOccupancy += 1;
  room.isCheckedIn = true;
  res.json(room);
};

// @desc    Check-out: -1 occupancy
// @route   POST /api/rooms/:id/checkout
const checkOutRoom = (req, res) => {
  const roomId = parseInt(req.params.id);
  const room = roomModel.findRoomById(roomId);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (room.currentOccupancy <= 0) {
    return res.status(400).json({ error: 'Room is already empty!' });
  }

  room.currentOccupancy -= 1;
  room.isCheckedIn = false;
  res.json(room);
};

module.exports = {
  getRooms,
  checkInRoom,
  checkOutRoom
};