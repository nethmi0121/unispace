import { useState, useEffect } from "react";
import RoomForm from "./RoomForm";
import RoomCard from "./RoomCard";
import "../styles/Dashboard.css";

const API_BASE_URL = "http://localhost:5000/api/rooms";

function AdminDashboard() {
  const [rooms, setRooms] = useState([]);

  // Fetch rooms from backend
  const fetchRooms = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Load rooms when component mounts
  useEffect(() => {
    fetchRooms();
  }, []);

  // Add Room
  const addRoom = async (newRoom) => {
    try {
      const payload = {
        roomName: newRoom.name,
        location: newRoom.location,
        capacity: Number(newRoom.capacity),
      };

      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add room.");
        return;
      }

      fetchRooms();
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };

  // Delete Room
  const deleteRoom = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to delete room.");
        return;
      }

      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  // Reset Count
  const resetCount = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reset/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to reset count.");
        return;
      }

      fetchRooms();
    } catch (error) {
      console.error("Error resetting count:", error);
    }
  };

  // Edit Room
  const editRoom = async (id) => {
    const room = rooms.find((r) => (r._id || r.id) === id);

    if (!room) return;

    const newName = prompt(
      "Enter new room name:",
      room.roomName || room.name
    );

    if (newName === null) return;

    const newLocation = prompt(
      "Enter new location:",
      room.location
    );

    if (newLocation === null) return;

    const newCapacity = prompt(
      "Enter new capacity:",
      room.capacity
    );

    if (newCapacity === null) return;

    if (Number(newCapacity) <= 0) {
      alert("Capacity must be greater than zero.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          roomName: newName,
          location: newLocation,
          capacity: Number(newCapacity),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to update room.");
        return;
      }

      fetchRooms();
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <RoomForm addRoom={addRoom} />

      <h2>Room List</h2>

      {rooms.length === 0 ? (
        <p>No rooms available.</p>
      ) : (
        rooms.map((room) => {
          const roomId = room._id || room.id;

          return (
            <RoomCard
              key={roomId}
              room={{
                ...room,
                id: roomId,
                name: room.roomName || room.name,
              }}
              deleteRoom={deleteRoom}
              resetCount={resetCount}
              editRoom={editRoom}
            />
          );
        })
      )}
    </div>
  );
}

export default AdminDashboard;