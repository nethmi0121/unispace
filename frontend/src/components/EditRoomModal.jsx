import React, { useState, useEffect } from "react";
import "../styles/RoomForm.css"; // Reuse your existing room form styles

function EditRoomModal({ room, onSave, onClose }) {
  const [roomName, setRoomName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");

  // Pre-fill form fields when a room is selected for editing
  useEffect(() => {
    if (room) {
      setRoomName(room.roomName || room.name || "");
      setLocation(room.location || "");
      setCapacity(room.capacity || "");
    }
  }, [room]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!roomName || !location || !capacity) {
      alert("Please fill in all fields.");
      return;
    }

    if (Number(capacity) <= 0) {
      alert("Capacity must be greater than zero.");
      return;
    }

    // Pass updated room payload back to AdminDashboard
    onSave(room._id || room.id, {
      roomName,
      name: roomName, // Fallback key depending on backend model
      location,
      capacity: Number(capacity),
    });
  };

  if (!room) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(58, 15, 24, 0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        fontFamily: "'Work Sans', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fffbf4",
          padding: "30px",
          borderRadius: "14px",
          width: "380px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          border: "1px solid rgba(201,162,39,0.35)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <h2
            style={{
              margin: 0,
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              color: "#3a0f18",
              fontSize: "20px",
            }}
          >
            Edit room
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#9a8b78" }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="room-form" style={{ background: "transparent", padding: 0, marginBottom: 0 }}>
          <label style={{ display: "block", textAlign: "left", marginBottom: "5px", fontWeight: 500, fontSize: "13px", color: "#5a4a3a" }}>
            Room name
          </label>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />

          <label style={{ display: "block", textAlign: "left", marginBottom: "5px", fontWeight: 500, fontSize: "13px", color: "#5a4a3a" }}>
            Location
          </label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />

          <label style={{ display: "block", textAlign: "left", marginBottom: "5px", fontWeight: 500, fontSize: "13px", color: "#5a4a3a" }}>
            Maximum capacity
          </label>
          <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />

          <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
            <button type="submit" style={{ flex: 1 }}>
              Save changes
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "10px 20px",
                backgroundColor: "#e8ddc8",
                color: "#5a4a3a",
                border: "none",
                borderRadius: "7px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRoomModal;