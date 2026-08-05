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

  const bgImageUrl =
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundImage: `
          linear-gradient(180deg, rgba(44, 11, 20, 0.88) 0%, rgba(92, 27, 38, 0.85) 50%, rgba(58, 15, 24, 0.92) 100%),
          url("${bgImageUrl}")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        padding: "32px 24px",
        boxSizing: "border-box",
        margin: 0,
      }}
    >
      <div className="dashboard" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="dashboard-header" style={{ textAlign: "center", color: "#fffbf4" }}>
          <div className="dashboard-eyebrow" style={{ color: "#e8c874", letterSpacing: "0.1em" }}>
            UNIVERSITY OF COLOMBO
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "36px", margin: "8px 0" }}>
            Student room portal
          </h1>
          <p style={{ color: "#d8b9a8" }}>
            Scan the door tablet's live QR code to check in or out.
          </p>
        </div>

        {loading ? (
          <div className="loading" style={{ color: "#fffbf4", textAlign: "center", padding: "40px" }}>
            Loading rooms…
          </div>
        ) : error ? (
          <div className="error" style={{ color: "#ff8b8b", textAlign: "center", padding: "40px" }}>
            {error}
          </div>
        ) : (
          <div className="rooms-grid">
            {rooms.map((room) => {
              const isFull = room.currentCount >= room.capacity;
              const occupancyPercentage = Math.round((room.currentCount / room.capacity) * 100);
              const status = getRoomStatus(room.currentCount, room.capacity);

              return (
                <div
                  key={room._id}
                  className={`room-card room-${status}`}
                  style={{
                    background: "rgba(255, 251, 244, 0.95)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "14px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  }}
                >
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
    </div>
  );
}

export default StudentPortal;