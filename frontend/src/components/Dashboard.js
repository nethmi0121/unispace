import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomCard from './RoomCard';
import QRCodeDisplay from './QRCodeDisplay';
import './RoomCard.css';

const Dashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        fetchRooms();
        const interval = setInterval(fetchRooms, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('/api/rooms');
            setRooms(response.data);
            setLastUpdate(new Date());
            setLoading(false);
            setError('');
        } catch (err) {
            console.error('Error fetching rooms:', err);
            setError('Failed to fetch rooms');
            setLoading(false);
        }
    };

    const handleQRClick = (room) => {
        setSelectedRoom(room);
        setShowQR(true);
    };

    const handleCloseQR = () => {
        setShowQR(false);
        setSelectedRoom(null);
    };

    const handleRefresh = async () => {
        await fetchRooms();
    };

    if (loading) return <div className="loading">⏳ Loading rooms...</div>;
    if (error) return <div className="error">❌ {error}</div>;

    const formatTime = (date) => {
        if (!date) return 'Never';
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <div>
                        <h1>🏫 Student Live Dashboard</h1>
                        <p>Real-time room occupancy tracker with QR Check-In</p>
                    </div>
                    <div className="header-status">
                        <span className="live-indicator">
                            <span className="live-dot"></span>
                            LIVE
                        </span>
                        <span className="last-update-header">
                            🔄 {formatTime(lastUpdate)}
                        </span>
                        <button onClick={handleRefresh} className="btn-refresh-header">
                            ⟳
                        </button>
                    </div>
                </div>
            </header>

            <div className="rooms-grid">
                {rooms.map(room => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        onQRClick={() => handleQRClick(room)}
                        onRefresh={handleRefresh}
                    />
                ))}
            </div>

            {showQR && selectedRoom && (
                <div className="qr-modal-overlay" onClick={handleCloseQR}>
                    <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="qr-close-btn" onClick={handleCloseQR}>✕</button>
                        <QRCodeDisplay
                            roomId={selectedRoom.id}
                            roomName={selectedRoom.name}
                            onClose={handleCloseQR}
                            onCheckIn={handleRefresh}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;