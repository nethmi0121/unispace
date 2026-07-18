import { useState } from "react";

import Navbar from "../components/Navbar";
import RoomForm from "../components/RoomForm";
import RoomCard from "../components/RoomCard";

import "../styles/Dashboard.css";

function AdminDashboard() {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Lab 101",
      location: "Block A",
      capacity: 40,
      currentCount: 12,
    },
  ]);

  // Add Room
  const addRoom = (newRoom) => {
    const exists = rooms.find(
      (room) =>
        room.name.toLowerCase() === newRoom.name.toLowerCase()
    );

    if (exists) {
      alert("Room name already exists.");
      return;
    }

    setRooms([
      ...rooms,
      {
        id: Date.now(),
        ...newRoom,
        currentCount: 0,
      },
    ]);
  };

  // Delete Room
  const deleteRoom = (id) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  // Reset Current Count
  const resetCount = (id) => {
    setRooms(
      rooms.map((room) =>
        room.id === id
          ? { ...room, currentCount: 0 }
          : room
      )
    );
  };

  // Edit Room
  const editRoom = (id) => {
    const room = rooms.find((room) => room.id === id);

    const newName = prompt("Enter new room name:", room.name);
    const newLocation = prompt("Enter new location:", room.location);
    const newCapacity = prompt("Enter new capacity:", room.capacity);

    if (!newName || !newLocation || !newCapacity) {
      return;
    }

    if (Number(newCapacity) <= 0) {
      alert("Capacity must be greater than zero.");
      return;
    }

    setRooms(
      rooms.map((room) =>
        room.id === id
          ? {
              ...room,
              name: newName,
              location: newLocation,
              capacity: Number(newCapacity),
            }
          : room
      )
    );
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">
        <h1>Admin Dashboard</h1>

        <RoomForm addRoom={addRoom} />

        <h2>Room List</h2>

        {rooms.length === 0 ? (
          <p>No rooms available.</p>
        ) : (
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              deleteRoom={deleteRoom}
              resetCount={resetCount}
              editRoom={editRoom}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;