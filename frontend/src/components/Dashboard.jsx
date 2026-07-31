import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentRoom from './StudentRoom';
import AnalyticsDashboard from '../AnalyticsDashboard'; 
import '../styles/StudentRoom.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/rooms');
      
      const roomData = Array.isArray(response.data)
        ? response.data
        : response.data?.rooms || response.data?.data || [];

      setRooms(roomData);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch rooms');
      setLoading(false);
    }
  };

  const handleCheckIn = async (roomId) => {
    try {
      const response = await axios.post(`/api/rooms/${roomId}/checkin`);
      const updatedRoom = response.data?.room || response.data;

      setRooms(prevRooms =>
        prevRooms.map(room => (room.id === roomId || room._id === roomId ? updatedRoom : room))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Check-in failed');
    }
  };

  const handleCheckOut = async (roomId) => {
    try {
      const response = await axios.post(`/api/rooms/${roomId}/checkout`);
      const updatedRoom = response.data?.room || response.data;

      setRooms(prevRooms =>
        prevRooms.map(room => (room.id === roomId || room._id === roomId ? updatedRoom : room))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Check-out failed');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🏫 Student Live Dashboard</h1>
        <p>Real-time room occupancy & campus analytics</p>

        {/* Tab Switcher */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === 'analytics' ? '#3b82f6' : '#e0e0e0',
              color: activeTab === 'analytics' ? '#fff' : '#333',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            📊 Analytics & Peak Hours
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === 'rooms' ? '#27ae60' : '#e0e0e0',
              color: activeTab === 'rooms' ? '#fff' : '#333',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🏫 Room Occupancy
          </button>
        </div>
      </header>

      {/* Tab Content */}
      {activeTab === 'analytics' ? (
        <AnalyticsDashboard />
      ) : (
        <div className="rooms-section">
          {loading ? (
            <div className="loading">Loading rooms...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="rooms-grid">
              {Array.isArray(rooms) && rooms.length > 0 ? (
                rooms.map(room => (
                  <StudentRoom
                    key={room.id || room._id}
                    room={room}
                    onCheckIn={handleCheckIn}
                    onCheckOut={handleCheckOut}
                  />
                ))
              ) : (
                <p style={{ textAlign: 'center', width: '100%' }}>No rooms found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;