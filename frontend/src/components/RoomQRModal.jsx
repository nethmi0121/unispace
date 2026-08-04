import React, { useState, useEffect } from 'react';

const FONT_IMPORT_ID = "unispace-fonts";

function ensureFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById(FONT_IMPORT_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_IMPORT_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&family=Work+Sans:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

const RoomQRModal = ({ roomId, roomName, onClose }) => {
  const [qrImage, setQrImage] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureFonts();
  }, []);

  const fetchQRCode = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${roomId}/qrcode`);
      const data = await res.json();
      if (res.ok) {
        setQrImage(data.qrImage);
        setTimeLeft(data.expiresIn || 600);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial QR Code
  useEffect(() => {
    fetchQRCode();
  }, [roomId]);

  // Timer & Auto-refresh every 10 mins
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          fetchQRCode(); // Auto-refresh when timer expires!
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [roomId]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(58, 15, 24, 0.55)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        fontFamily: "'Work Sans', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: '#fffbf4',
          padding: '28px',
          borderRadius: '14px',
          width: '320px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          border: '1px solid rgba(201,162,39,0.35)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              color: '#3a0f18',
              fontSize: '17px',
            }}
          >
            Room door display
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#9a8b78',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontWeight: 600, margin: '10px 0 16px', color: '#5a4a3a', fontSize: '14px' }}>{roomName}</p>

        {loading ? (
          <div style={{ padding: '50px 0', color: '#9a8b78', fontSize: '14px' }}>Generating live QR code…</div>
        ) : (
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '10px',
                background: '#fff',
                borderRadius: '10px',
                border: '1px solid #f0e6d2',
              }}
            >
              <img src={qrImage} alt="Room QR" style={{ width: '200px', height: '200px', display: 'block' }} />
            </div>

            <div
              style={{
                margin: '16px 0',
                fontSize: '13.5px',
                fontWeight: 600,
                color: timeLeft < 60 ? '#8a2b3b' : '#5a4a3a',
              }}
            >
              Refreshes in {formatTime(timeLeft)}
            </div>

            <button
              onClick={fetchQRCode}
              style={{
                padding: '8px 16px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                background: '#c9a227',
                color: '#3a2c05',
                border: 'none',
                borderRadius: '6px',
              }}
            >
              Force refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomQRModal;