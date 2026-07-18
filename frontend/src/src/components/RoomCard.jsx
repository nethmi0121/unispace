import "../styles/RoomCard.css";

function RoomCard({ room, deleteRoom, resetCount, editRoom }) {
  return (
    <div className="room-card">
      <h3>Room: {room.name}</h3>

      <p>
        <strong>Location:</strong> {room.location}
      </p>

      <p>
        <strong>Capacity:</strong> {room.capacity}
      </p>

      <p>
        <strong>Current Count:</strong> {room.currentCount}
      </p>

      <div className="button-group">
        <button onClick={() => editRoom(room.id)}>
          Edit
        </button>

        <button onClick={() => deleteRoom(room.id)}>
          Delete
        </button>

        <button onClick={() => resetCount(room.id)}>
          Reset Count
        </button>
      </div>
    </div>
  );
}

export default RoomCard;