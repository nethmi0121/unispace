import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomCard from './RoomCard';
import './RoomCard.css';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/rooms');
      setRooms(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch rooms');
      setLoading(false);
    }
  };

  const handleCheckIn = async (roomId) => {
    try {
      const response = await axios.post(`/api/rooms/${roomId}/checkin`);
      setRooms(rooms.map(room => 
        room.id === roomId ? response.data : room
      ));
    } catch (err) {
      alert(err.response?.data?.error || 'Check-in failed');
    }
  };

  const handleCheckOut = async (roomId) => {
    try {
      const response = await axios.post(`/api/rooms/${roomId}/checkout`);
      setRooms(rooms.map(room => 
        room.id === roomId ? response.data : room
      ));
    } catch (err) {
      alert(err.response?.data?.error || 'Check-out failed');
    }
  };

  if (loading) return <div className="loading">Loading rooms...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🏫 Student Live Dashboard</h1>
        <p>Real-time room occupancy tracker</p>
      </header>
      <div className="rooms-grid">
        {rooms.map(room => (
          <RoomCard
            key={room.id}
            room={room}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;