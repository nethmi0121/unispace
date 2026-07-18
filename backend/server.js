const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let rooms = [
  { id: 1, name: 'Room 101', capacity: 30, currentOccupancy: 15, isCheckedIn: false },
  { id: 2, name: 'Room 102', capacity: 25, currentOccupancy: 20, isCheckedIn: false },
  { id: 3, name: 'Room 103', capacity: 40, currentOccupancy: 35, isCheckedIn: false },
  { id: 4, name: 'Room 104', capacity: 20, currentOccupancy: 10, isCheckedIn: false },
];

// Get all rooms
app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

// Check-in: +1 occupancy
app.post('/api/rooms/:id/checkin', (req, res) => {
  const roomId = parseInt(req.params.id);
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  if (room.currentOccupancy >= room.capacity) {
    return res.status(400).json({ error: 'Room is full!' });
  }
  
  room.currentOccupancy += 1;
  room.isCheckedIn = true;
  res.json(room);
});

// Check-out: -1 occupancy
app.post('/api/rooms/:id/checkout', (req, res) => {
  const roomId = parseInt(req.params.id);
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  if (room.currentOccupancy <= 0) {
    return res.status(400).json({ error: 'Room is already empty!' });
  }
  
  room.currentOccupancy -= 1;
  room.isCheckedIn = false;
  res.json(room);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});