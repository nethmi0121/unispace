import "../styles/RoomCard.css";

function RoomCard({ room, deleteRoom, resetCount, onEdit }) {
  const roomId = room._id || room.id;
  const roomName = room.roomName || room.name;

  return (
    <div className="room-card">
      <h3>{roomName}</h3>

      <p>
        <strong>Location:</strong> {room.location}
      </p>

      <p>
        <strong>Capacity:</strong> {room.capacity}
      </p>

      <p>
        <strong>Current count:</strong> {room.currentCount}
      </p>

      <div className="button-group">
        <button className="secondary" onClick={onEdit}>
          Edit
        </button>
        <button className="danger" onClick={() => deleteRoom(roomId)}>
          Delete
        </button>
        <button onClick={() => resetCount(roomId)}>
          Reset count
        </button>
      </div>
    </div>
  );
}

export default RoomCard;