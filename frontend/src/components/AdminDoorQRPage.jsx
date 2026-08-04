import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/rooms';

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

function AdminDoorQRPage({ onBack }) {
  const [rooms, setRooms] = useState([]);
  const [qrImages, setQrImages] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10-minute timer
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureFonts();
  }, []);

  // Fetch rooms and their QR image data
  const fetchAllQRCodes = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      const roomList = res.data;
      setRooms(roomList);

      // Fetch QR image for each room concurrently
      const qrPromises = roomList.map((room) =>
        axios.get(`${API_BASE_URL}/${room._id}/qrcode`).then((r) => ({
          id: room._id,
          image: r.data.qrImage,
        }))
      );

      const qrResults = await Promise.all(qrPromises);
      const qrMap = {};
      qrResults.forEach((item) => {
        qrMap[item.id] = item.image;
      });

      setQrImages(qrMap);
      setTimeLeft(600);
    } catch (err) {
      console.error('Error loading room QR codes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQRCodes();
  }, []);

  // Countdown timer for 10-min TOTP refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          fetchAllQRCodes();
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#fbf7ef', minHeight: '100vh', fontFamily: "'Work Sans', sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ width: '20px', height: '1px', background: '#c9a227', display: 'inline-block' }} />
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: '#8a2b3b',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Admin
            </span>
          </div>
          <h2 style={{ margin: 0, fontFamily: "'Fraunces', serif", fontWeight: 600, color: '#3a0f18', fontSize: '1.5rem' }}>
            Room door display QRs
          </h2>
          <p style={{ color: '#9a8b78', margin: '6px 0 0 0', fontSize: '13.5px' }}>
            Live TOTP QR codes for physical room doors
          </p>
        </div>

        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, color: timeLeft < 60 ? '#8a2b3b' : '#5a4a3a', fontSize: '13.5px' }}>
            Refreshes in {formatTime(timeLeft)}
          </span>
          <button
            onClick={fetchAllQRCodes}
            style={{
              padding: '9px 18px',
              backgroundColor: '#c9a227',
              color: '#3a2c05',
              border: 'none',
              borderRadius: '7px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13.5px',
            }}
          >
            Refresh
          </button>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                padding: '9px 18px',
                backgroundColor: 'transparent',
                color: '#8a2b3b',
                border: '1px solid #8a2b3b',
                borderRadius: '7px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13.5px',
              }}
            >
              Back
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9a8b78' }}>Loading room QR codes…</div>
      ) : (
        /* Grid of Actual Room QR Images */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '22px' }}>
          {rooms.map((room) => (
            <div
              key={room._id}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #f0e6d2',
                borderLeft: '5px solid #c9a227',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 3px 10px rgba(58, 15, 24, 0.06)',
              }}
            >
              <h3 style={{ margin: '0 0 4px 0', fontFamily: "'Fraunces', serif", fontWeight: 600, color: '#3a0f18' }}>
                {room.roomName || room.name}
              </h3>
              <p style={{ color: '#9a8b78', fontSize: '12.5px', margin: '0 0 16px 0' }}>{room.location}</p>

              {/* Actual QR code image display */}
              {qrImages[room._id] ? (
                <div
                  style={{
                    display: 'inline-block',
                    padding: '8px',
                    background: '#fbf7ef',
                    borderRadius: '10px',
                    border: '1px solid #f0e6d2',
                  }}
                >
                  <img
                    src={qrImages[room._id]}
                    alt={`QR Code for ${room.roomName}`}
                    style={{ width: '190px', height: '190px', display: 'block', borderRadius: '4px' }}
                  />
                </div>
              ) : (
                <div style={{ height: '190px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b6a894', fontSize: '13.5px' }}>
                  Generating QR…
                </div>
              )}

              <div style={{ marginTop: '14px', fontSize: '12px', color: '#9a8b78', fontWeight: 500 }}>
                Students scan this QR code to check in / out
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDoorQRPage;