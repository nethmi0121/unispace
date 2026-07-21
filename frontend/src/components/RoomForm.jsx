import { useState } from "react";
import "../styles/RoomForm.css";

function RoomForm({ addRoom }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!name || !location || !capacity) {
      alert("Please fill all fields.");
      return;
    }

    // Check if capacity is valid
    if (Number(capacity) <= 0) {
      alert("Capacity must be greater than zero.");
      return;
    }

    // Send data to AdminDashboard
    addRoom({
      name,
      location,
      capacity: Number(capacity),
    });

    // Clear the form
    setName("");
    setLocation("");
    setCapacity("");
  };

  return (
    <form className="room-form" onSubmit={handleSubmit}>
      <h2>Add New Room</h2>

      <input
        type="text"
        placeholder="Room Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="number"
        placeholder="Maximum Capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />

      <button type="submit">Add Room</button>
    </form>
  );
}

export default RoomForm;