import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

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

const QRScanModal = ({ roomId, roomName, mode = 'checkin', onClose, onSuccess }) => {
  const [manualToken, setManualToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const accent = mode === 'checkin' ? '#c9a227' : '#8a2b3b';
  const accentText = mode === 'checkin' ? '#3a2c05' : '#fff';

  useEffect(() => {
    ensureFonts();
  }, []);

  const handleVerifyToken = async (scannedToken) => {
    setLoading(true);
    setError('');

    const studentId = localStorage.getItem('studentId') || 'STUDENT_TEST';
    const endpoint = mode === 'checkin' ? 'scan-checkin' : 'scan-checkout';

    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: scannedToken, studentId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        onSuccess();
      } else {
        setError(data.error || 'Scan failed');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader-container', { fps: 10, qrbox: { width: 220, height: 220 } }, false);
    scanner.render((decodedText) => {
      let tokenToSubmit = decodedText;
      try {
        const parsed = JSON.parse(decodedText);
        tokenToSubmit = parsed.t || parsed.token || decodedText;
      } catch (e) {}
      scanner.clear();
      handleVerifyToken(tokenToSubmit);
    }, () => {});

    return () => { scanner.clear().catch(() => {}); };
  }, []);

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
          padding: '26px',
          borderRadius: '14px',
          width: '360px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          border: `1px solid ${accent}55`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3
            style={{
              margin: 0,
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              color: '#3a0f18',
              fontSize: '16px',
              textAlign: 'left',
            }}
          >
            {mode === 'checkin' ? 'Check in' : 'Check out'} · {roomName}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#9a8b78' }}>
            ✕
          </button>
        </div>

        {error && (
          <div style={{ color: '#8a2b3b', backgroundColor: '#f6e4e6', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <div
          id="qr-reader-container"
          style={{ width: '100%', marginBottom: '15px', borderRadius: '10px', overflow: 'hidden' }}
        ></div>

        <form onSubmit={(e) => { e.preventDefault(); handleVerifyToken(manualToken); }}>
          <input
            type="text"
            placeholder="6-digit token"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '8px',
              border: '1px solid #e8ddc8',
              textAlign: 'center',
              letterSpacing: '2px',
              fontWeight: 600,
              boxSizing: 'border-box',
              fontFamily: "'Work Sans', sans-serif",
            }}
          />
          <button
            type="submit"
            disabled={loading || !manualToken}
            style={{
              width: '100%',
              padding: '11px',
              marginTop: '10px',
              backgroundColor: accent,
              color: accentText,
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: loading || !manualToken ? 'not-allowed' : 'pointer',
              opacity: loading || !manualToken ? 0.6 : 1,
            }}
          >
            {loading ? 'Verifying…' : `Confirm ${mode === 'checkin' ? 'check in' : 'check out'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QRScanModal;