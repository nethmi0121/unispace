import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import './QRCodeDisplay.css';

const QRCodeDisplay = ({ roomId, roomName, onClose, onCheckIn }) => {
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(600);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [scanStatus, setScanStatus] = useState('');

    useEffect(() => {
        fetchQRCode();
        const interval = setInterval(fetchQRCode, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [roomId]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const fetchQRCode = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/rooms/${roomId}/qrcode`);
            setQrData(response.data);
            setTimeLeft(response.data.expiresIn || 600);
            setError(null);
            setScanStatus('');
        } catch (err) {
            console.error('Error fetching QR code:', err);
            setError('Failed to load QR code');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setScanStatus('');
        try {
            await axios.post(`/api/rooms/${roomId}/refreshqr`);
            await fetchQRCode();
            setScanStatus('✅ QR Code refreshed successfully!');
        } catch (err) {
            setError('Failed to refresh QR code');
        } finally {
            setIsRefreshing(false);
        }
    };

    const getQRValue = () => {
        if (!qrData || !qrData.qrData) return '{}';
        return JSON.stringify({
            roomId: roomId,
            token: qrData.qrData.t || qrData.qrData.token,
            timestamp: qrData.qrData.ts || qrData.qrData.timestamp,
            action: 'checkin'
        });
    };

    if (loading) return <div className="qr-loading">⏳ Generating QR Code...</div>;
    if (error) return <div className="qr-error">❌ {error}</div>;

    return (
        <div className="qr-container">
            <div className="qr-header">
                <h3>📱 {roomName}</h3>
                <span className={`qr-timer ${timeLeft <= 60 ? 'qr-timer-danger' : ''}`}>
                    ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
            </div>
            
            <div className="qr-code-wrapper">
                {qrData && (
                    <QRCodeCanvas
                        value={getQRValue()}
                        size={250}
                        level="L"
                        includeMargin={true}
                    />
                )}
                <div className="qr-overlay">
                    <p>📸 Scan with Phone</p>
                </div>
            </div>

            {scanStatus && (
                <div className={`qr-status ${scanStatus.includes('✅') ? 'qr-success' : 'qr-error-box'}`}>
                    {scanStatus}
                </div>
            )}

            <div className="qr-info">
                <p>📌 Scan this QR code with your phone to check in</p>
                <p>🔄 Auto-refreshes every 10 minutes</p>
                <p>📋 Room: {roomName}</p>
                <p className={`qr-valid ${timeLeft > 0 ? 'valid' : 'expired'}`}>
                    {timeLeft > 0 ? '✅ QR Code is VALID' : '⛔ QR Code EXPIRED'}
                </p>
            </div>

            <div className="qr-actions">
                <button 
                    onClick={handleRefresh} 
                    disabled={isRefreshing}
                    className="btn-refresh"
                >
                    {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh QR'}
                </button>
                <button onClick={onClose} className="btn-close">
                    ✕ Close
                </button>
            </div>
        </div>
    );
};

export default QRCodeDisplay;