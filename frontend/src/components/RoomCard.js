import React from 'react';
import './RoomCard.css';

const RoomCard = ({ room, onCheckIn, onCheckOut }) => {
  const isFull = room.currentOccupancy >= room.capacity;
  const occupancyPercentage = (room.currentOccupancy / room.capacity) * 100;

  const getStatusClass = () => {
    if (isFull) return 'room-full';
    if (occupancyPercentage > 70) return 'room-warning';
    return 'room-available';
  };

  return (
    <div className={`room-card ${getStatusClass()}`}>
      <div className="room-header">
        <h2>{room.name}</h2>
        <span className="room-status-badge">
          {isFull ? '🔴 FULL' : '🟢 AVAILABLE'}
        </span>
      </div>

      <div className="room-occupancy">
        <div className="occupancy-info">
          <span className="occupancy-number">{room.currentOccupancy}</span>
          <span className="occupancy-total">/ {room.capacity}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="room-actions">
        <button
          className="btn btn-checkin"
          onClick={() => onCheckIn(room.id)}
          disabled={isFull}
        >
          ✅ Check In
        </button>
        <button
          className="btn btn-checkout"
          onClick={() => onCheckOut(room.id)}
          disabled={room.currentOccupancy === 0}
        >
          🚪 Check Out
        </button>
      </div>

      <div className="room-status">
        Status: {room.isCheckedIn ? '🟢 Checked In' : '⚪ Checked Out'}
      </div>
    </div>
  );
};

export default RoomCard;
