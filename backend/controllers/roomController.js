const Room = require("../models/Room");

// Create Room
exports.createRoom = async (req, res) => {
  try {
    const { roomName, location, capacity } = req.body;

    if (capacity < 0) {
      return res.status(400).json({
        message: "Capacity cannot be negative",
      });
    }

    const existing = await Room.findOne({ roomName });

    if (existing) {
      return res.status(400).json({
        message: "Room already exists",
      });
    }

    const room = new Room({
      roomName,
      location,
      capacity,
    });

    await room.save();

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get Rooms
exports.getRooms = async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
};

// Update Room
exports.updateRoom = async (req, res) => {
  const room = await Room.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(room);
};

// Delete Room
exports.deleteRoom = async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);

  res.json({
    message: "Room Deleted",
  });
};

// Reset Count
exports.resetCount = async (req, res) => {
  const room = await Room.findByIdAndUpdate(
    req.params.id,
    {
      currentCount: 0,
    },
    { new: true }
  );

  res.json(room);
};