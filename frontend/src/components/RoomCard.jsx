import "../styles/RoomCard.css";

function RoomCard({ room, deleteRoom, resetCount, editRoom }) {
  // Extract MongoDB's _id cleanly (falling back to id if necessary)
  const roomId = room._id || room.id;

  return (
    <div className="room-card">
      <h3>Room: {room.roomName || room.name}</h3>

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
        <button onClick={() => editRoom(roomId)}>
          Edit
        </button>

        <button onClick={() => deleteRoom(roomId)}>
          Delete
        </button>

        <button onClick={() => resetCount(roomId)}>
          Reset Count
        </button>
      </div>
    </div>
  );
}

export default RoomCard;