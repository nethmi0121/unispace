// In-memory data store
let rooms = [
  { id: 1, name: 'Room 101', capacity: 30, currentOccupancy: 15, isCheckedIn: false },
  { id: 2, name: 'Room 102', capacity: 25, currentOccupancy: 20, isCheckedIn: false },
  { id: 3, name: 'Room 103', capacity: 40, currentOccupancy: 35, isCheckedIn: false },
  { id: 4, name: 'Room 104', capacity: 20, currentOccupancy: 10, isCheckedIn: false },
];

module.exports = {
  getAllRooms: () => rooms,
  findRoomById: (id) => rooms.find(r => r.id === id)
};