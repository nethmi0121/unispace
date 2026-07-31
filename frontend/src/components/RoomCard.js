import React, { useState, useEffect } from 'react';
import './RoomCard.css';

const RoomCard = ({ room, onQRClick, onRefresh }) => {
    const [currentOccupancy, setCurrentOccupancy] = useState(room.currentOccupancy);
    const [isCheckedIn, setIsCheckedIn] = useState(room.isCheckedIn);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    useEffect(() => {
        setCurrentOccupancy(room.currentOccupancy);
        setIsCheckedIn(room.isCheckedIn);
        setLastUpdate(new Date());
    }, [room]);

    const isFull = currentOccupancy >= room.capacity;
    const occupancyPercentage = (currentOccupancy / room.capacity) * 100;
    
    const getStatusClass = () => {
        if (isFull) return 'room-full';
        if (occupancyPercentage > 70) return 'room-warning';
        return 'room-available';
    };

    const getStatusText = () => {
        if (isFull) return '🔴 FULL';
        if (occupancyPercentage > 70) return '🟠 NEAR FULL';
        return '🟢 AVAILABLE';
    };

    const getStatusMessage = () => {
        if (isCheckedIn) return '🟢 Currently Checked In';
        return '⚪ Not Checked In';
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className={`room-card ${getStatusClass()}`}>
            <div className="room-header">
                <h2>{room.name}</h2>
                <span className="room-status-badge">
                    {getStatusText()}
                </span>
            </div>
            
            <div className="room-occupancy">
                <div className="occupancy-info">
                    <span className="occupancy-number">{currentOccupancy}</span>
                    <span className="occupancy-total">/ {room.capacity}</span>
                    <span className="occupancy-percent">
                        ({Math.round(occupancyPercentage)}%)
                    </span>
                </div>
                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                    ></div>
                </div>
            </div>

            <div className="room-status-section">
                <div className="status-indicator">
                    <span className="status-dot"></span>
                    <span className="status-text">{getStatusMessage()}</span>
                </div>
                <div className="last-updated">
                    <span className="update-time">🔄 {formatTime(lastUpdate)}</span>
                </div>
            </div>

            <div className="room-actions">
                <button 
                    className="btn btn-qr"
                    onClick={() => onQRClick()}
                >
                    📱 QR Code
                </button>
            </div>
        </div>
    );
};

export default RoomCard;