import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRScanModal from './QRScanModel';
import '../styles/StudentRoom.css';

const API_BASE_URL = 'http://localhost:5000/api/rooms';
const WARNING_THRESHOLD = 0.7; // occupancy at or above this % shows the amber "filling up" state

function getRoomStatus(currentCount, capacity) {
  const ratio = capacity > 0 ? currentCount / capacity : 0;
  if (currentCount >= capacity) return 'full';
  if (ratio >= WARNING_THRESHOLD) return 'warning';
  return 'available';
}

const STATUS_LABEL = {
  available: 'Available',
  warning: 'Filling up',
  full: 'Full',
};

function StudentPortal() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Tracks room AND mode for student scanning: { room: object | null, mode: 'checkin' | 'checkout' }
  const [scanAction, setScanAction] = useState({ room: null, mode: 'checkin' });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setRooms(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load rooms.');
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-eyebrow">University of Colombo</div>
        <h1>Student room portal</h1>
        <p>Scan the door tablet's live QR code to check in or out.</p>
      </div>

      {loading ? (
        <div className="loading">Loading rooms…</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => {
            const isFull = room.currentCount >= room.capacity;
            const occupancyPercentage = Math.round((room.currentCount / room.capacity) * 100);
            const status = getRoomStatus(room.currentCount, room.capacity);

            return (
              <div key={room._id} className={`room-card room-${status}`}>
                <div className="room-header">
                  <h2>{room.roomName || room.name}</h2>
                  <span className="room-status-badge">{STATUS_LABEL[status]}</span>
                </div>

                <p className="room-location">{room.location}</p>

                <div className="room-occupancy">
                  <div className="occupancy-info">
                    <span className="occupancy-number">{room.currentCount}</span>
                    <span className="occupancy-total">
                      / {room.capacity} · {occupancyPercentage}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Action buttons: both require QR scanning */}
                <div className="room-actions">
                  <button
                    className="btn btn-checkin"
                    onClick={() => setScanAction({ room, mode: 'checkin' })}
                    disabled={isFull}
                  >
                    Scan check in
                  </button>

                  <button
                    className="btn btn-checkout"
                    onClick={() => setScanAction({ room, mode: 'checkout' })}
                    disabled={room.currentCount === 0}
                  >
                    Scan check out
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal to scan the QR code */}
      {scanAction.room && (
        <QRScanModal
          roomId={scanAction.room._id}
          roomName={scanAction.room.roomName || scanAction.room.name}
          mode={scanAction.mode}
          onClose={() => setScanAction({ room: null, mode: 'checkin' })}
          onSuccess={() => {
            setScanAction({ room: null, mode: 'checkin' });
            fetchRooms(); // Refresh room counts automatically
          }}
        />
      )}
    </div>
  );
}

export default StudentPortal;