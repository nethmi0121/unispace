const Room = require("../models/Room");
const Student = require("../models/Student");
const UsageLog = require("../models/UsageLog");
const qrService = require("../services/qrService");

// ==========================================
// 1. STANDARD ROOM CRUD CONTROLLERS
// ==========================================

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
      { currentCount: 0, checkedInStudents: [] },
      { new: true }
    );
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Failed to reset count" });
  }
};

// Check-in (Direct API button backup)
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

    // Log this transaction so it shows up in peak-hours analytics
    await UsageLog.create({
      roomName: room.roomName,
      actionType: 'check-in',
    });

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Server error during check-in' });
  }
};

// Check-out (Direct API button backup)
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

    // Log this transaction so it shows up in peak-hours analytics
    await UsageLog.create({
      roomName: room.roomName,
      actionType: 'check-out',
    });

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Server error during check-out' });
  }
};

// ==========================================
// 2. TOTP & QR CODE CONTROLLERS
// ==========================================

// Live 10-minute TOTP QR Code Display
const getRoomQRCode = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);

    if (!room) return res.status(404).json({ error: "Room not found" });

    const qrData = await qrService.generateQRCodeImage(roomId);

    res.json({
      roomId: room._id,
      roomName: room.roomName,
      qrImage: qrData.qrImage,
      qrData: qrData.qrData,
      expiresIn: qrData.expiresIn // 600 seconds (10 mins)
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
};

// Scan QR to CHECK IN
const scanAndCheckIn = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { token, studentId } = req.body;

    if (!token || !studentId) {
      return res.status(400).json({ error: "QR token and Student ID are required" });
    }

    // 1. Verify TOTP token
    const isValid = qrService.verifyQRCode(roomId, token);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired QR code. Scan the updated door display." });
    }

    // 2. Prevent checking into ANY room if already checked into one across the system
    const allRooms = await Room.find({});
    const alreadyCheckedInRoom = allRooms.find(r => 
      r.checkedInStudents && r.checkedInStudents.some(id => id.toString() === studentId.toString())
    );

    if (alreadyCheckedInRoom) {
      return res.status(400).json({
        error: `You are already checked into ${alreadyCheckedInRoom.roomName || alreadyCheckedInRoom.name}. Please check out there first!`
      });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    if (room.currentCount >= room.capacity) {
      return res.status(400).json({ error: "Room is full!" });
    }

    // 3. Add student ID & increment count
    room.currentCount += 1;
    if (!room.checkedInStudents) room.checkedInStudents = [];
    room.checkedInStudents.push(studentId);
    
    await room.save();

    // Log this transaction so it shows up in peak-hours analytics
    await UsageLog.create({
      roomName: room.roomName,
      actionType: 'check-in',
    });

    res.json({
      success: true,
      message: `Successfully checked into ${room.roomName || room.name}`,
      room: room
    });
  } catch (error) {
    console.error("Check-in Error:", error);
    res.status(500).json({ error: "Server error during check-in: " + error.message });
  }
};

// Scan QR to CHECK OUT
const scanAndCheckOut = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { token, studentId } = req.body;

    if (!token || !studentId) {
      return res.status(400).json({ error: "QR token and Student ID are required" });
    }

    // 1. Verify TOTP token
    const isValid = qrService.verifyQRCode(roomId, token);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired QR code." });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    // 2. Find student index using string representation comparison
    const studentIndex = room.checkedInStudents 
      ? room.checkedInStudents.findIndex(id => id.toString() === studentId.toString())
      : -1;

    if (studentIndex === -1) {
      return res.status(400).json({ error: "You are not checked into this room." });
    }

    // 3. Remove student and decrement count
    room.currentCount = Math.max(0, room.currentCount - 1);
    room.checkedInStudents.splice(studentIndex, 1);
    await room.save();

    // Log this transaction so it shows up in peak-hours analytics
    await UsageLog.create({
      roomName: room.roomName,
      actionType: 'check-out',
    });

    res.json({
      success: true,
      message: `Successfully checked out of ${room.roomName || room.name}`,
      room: room
    });
  } catch (error) {
    console.error("Check-out Error:", error);
    res.status(500).json({ error: "Server error during check-out: " + error.message });
  }
};

// Export ALL functions cleanly
module.exports = {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom,
  resetCount,
  checkInRoom,
  checkOutRoom,
  getRoomQRCode,
  scanAndCheckIn,
  scanAndCheckOut
};