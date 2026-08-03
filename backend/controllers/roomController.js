const Room = require("../models/Room");

// Create Room
const createRoom = async (req, res) => {
  try {
    const { roomName, location, capacity } = req.body;

    if (capacity < 0) {
      return res.status(400).json({ message: "Capacity cannot be negative" });
    }

    const existing = await Room.findOne({ roomName });
    if (existing) {
      return res.status(400).json({ message: "Room already exists" });
    }

    const room = new Room({ roomName, location, capacity });
    await room.save();

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get Rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

// Update Room
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Failed to update room" });
  }
};

// Delete Room
const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete room" });
  }
};

// Reset Count
const resetCount = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { currentCount: 0 },
      { new: true }
    );
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Failed to reset count" });
  }
};

// Check-in: +1 occupancy
const checkInRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.currentCount >= room.capacity) {
      return res.status(400).json({ error: 'Room is full!' });
    }

    room.currentCount += 1;
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Server error during check-in' });
  }
};

// Check-out: -1 occupancy
const checkOutRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.currentCount <= 0) {
      return res.status(400).json({ error: 'Room is already empty!' });
    }

    room.currentCount -= 1;
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Server error during check-out' });
  }
};

// 🚨 Single export object containing ALL 7 functions!
module.exports = {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom,
  resetCount,
  checkInRoom,
  checkOutRoom
};