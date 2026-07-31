import React, { useState } from 'react';
import axios from 'axios';

const QRScanner = () => {
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // This function simulates what happens when phone scans QR
    // The scanned data comes from the QR code
    const handleScan = async (scannedData) => {
        setIsLoading(true);
        setStatus('Processing...');
        
        try {
            // Parse the scanned QR data
            let data;
            try {
                data = JSON.parse(scannedData);
            } catch {
                // If not JSON, try to use as token
                data = { token: scannedData };
            }

            const roomId = data.roomId || data.r;
            const token = data.token || data.t;

            if (!roomId || !token) {
                setStatus('❌ Invalid QR Code');
                setMessage('Please scan a valid room QR code');
                setIsLoading(false);
                return;
            }

            // Send check-in request to backend
            const response = await axios.post(`/api/rooms/${roomId}/scan`, {
                token: token
            });

            if (response.data.success) {
                setStatus('✅ Check-in Successful!');
                setMessage(`You have been checked into Room ${roomId}`);
                // Play success sound or show animation
            } else {
                setStatus('❌ Check-in Failed');
                setMessage(response.data.error || 'Please try again');
            }
        } catch (error) {
            console.error('Scan error:', error);
            setStatus('❌ Error');
            setMessage(error.response?.data?.error || 'Failed to check in');
        } finally {
            setIsLoading(false);
        }
    };

    // For demo purposes - click to simulate scanning
    const simulateScan = () => {
        // This is the data that would come from the QR code
        const demoData = {
            roomId: 1,
            token: "233734",
            timestamp: 2975875,
            action: "checkin"
        };
        handleScan(JSON.stringify(demoData));
    };

    return (
        <div className="phone-scanner">
            <div className="scanner-header">
                <h1>📱 Scan QR Code</h1>
                <p>Point your camera at the QR code to check in</p>
            </div>

            <div className="scanner-status">
                {status && (
                    <div className={`status-box ${status.includes('✅') ? 'success' : 'error'}`}>
                        <h2>{status}</h2>
                        <p>{message}</p>
                    </div>
                )}
            </div>

            <div className="scanner-instructions">
                <div className="instruction-step">
                    <span className="step-number">1</span>
                    <p>Find the QR code in your study room</p>
                </div>
                <div className="instruction-step">
                    <span className="step-number">2</span>
                    <p>Open your phone camera</p>
                </div>
                <div className="instruction-step">
                    <span className="step-number">3</span>
                    <p>Scan the QR code</p>
                </div>
                <div className="instruction-step">
                    <span className="step-number">4</span>
                    <p>Check in automatically!</p>
                </div>
            </div>

            {isLoading && <div className="loading-spinner">⏳ Processing...</div>}

            {/* For testing without a phone */}
            <div className="test-section">
                <p style={{ fontSize: '0.8rem', color: '#95a5a6' }}>
                    🔧 Demo Mode: Click below to simulate scanning
                </p>
                <button onClick={simulateScan} className="btn-simulate">
                    📷 Simulate Scan
                </button>
            </div>
        </div>
    );
};

export default QRScanner;