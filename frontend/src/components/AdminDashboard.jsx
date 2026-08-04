import { useState, useEffect } from "react";
import RoomForm from "./RoomForm";
import RoomCard from "./RoomCard";
import EditRoomModal from "./EditRoomModal"; // 👈 Integrated Edit Modal
import "../styles/Dashboard.css";

const API_BASE_URL = "http://localhost:5000/api/rooms";

function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null); // 👈 Tracks room being edited in modal

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
    if (!window.confirm("Are you sure you want to delete this room?")) return;

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

  // Save updated room from Edit Modal
  const handleSaveUpdatedRoom = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to update room.");
        return;
      }

      setEditingRoom(null); // Close Modal
      fetchRooms(); // Refresh rooms list
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {rooms.map((room) => {
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
                onEdit={() => setEditingRoom(room)} // 👈 Triggers modal opening
              />
            );
          })}
        </div>
      )}

      {/* ✏️ Edit Room Modal */}
      {editingRoom && (
        <EditRoomModal
          room={editingRoom}
          onSave={handleSaveUpdatedRoom}
          onClose={() => setEditingRoom(null)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;