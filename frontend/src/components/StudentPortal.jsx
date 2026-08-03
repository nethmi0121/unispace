import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StudentRoom.css'; // Optional styling import

const API_BASE_URL = 'http://localhost:5000/api/rooms';

function StudentPortal() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleCheckIn = async (roomId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${roomId}/checkin`);
      setRooms((prevRooms) =>
        prevRooms.map((r) => (r._id === roomId ? response.data : r))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Check-in failed');
    }
  };

  const handleCheckOut = async (roomId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${roomId}/checkout`);
      setRooms((prevRooms) =>
        prevRooms.map((r) => (r._id === roomId ? response.data : r))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Check-out failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="card shadow-sm" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3>🎓 Student Room Portal</h3>
        <p className="text-muted">Live room occupancy and instant check-in / check-out.</p>
      </div>

      {loading ? (
        <div>Loading rooms...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {rooms.map((room) => {
            const isFull = room.currentCount >= room.capacity;
            const occupancyPercentage = Math.round((room.currentCount / room.capacity) * 100);

            return (
              <div 
                key={room._id} 
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  padding: '16px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0 }}>{room.roomName || room.name}</h4>
                  <span>{isFull ? '🔴 FULL' : '🟢 AVAILABLE'}</span>
                </div>

                <p style={{ margin: '8px 0', color: '#666', fontSize: '14px' }}>
                  📍 {room.location}
                </p>

                <div style={{ margin: '15px 0' }}>
                  <div>Occupancy: <strong>{room.currentCount}</strong> / {room.capacity} ({occupancyPercentage}%)</div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${Math.min(occupancyPercentage, 100)}%`, 
                        backgroundColor: isFull ? '#ef4444' : '#22c55e',
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    onClick={() => handleCheckIn(room._id)}
                    disabled={isFull}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: isFull ? '#cbd5e1' : '#22c55e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: isFull ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ✅ Check In
                  </button>
                  <button
                    onClick={() => handleCheckOut(room._id)}
                    disabled={room.currentCount === 0}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: room.currentCount === 0 ? '#cbd5e1' : '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: room.currentCount === 0 ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🚪 Check Out
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentPortal;