import React, { useState } from 'react';

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

const Login = ({ onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    ensureFonts();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Saving the web token in localStorage
        localStorage.setItem('token', data.token);
        onLoginSuccess();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to authentication server');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #3a0f18 0%, #5c1b26 45%, #7a2534 100%)',
        fontFamily: "'Work Sans', sans-serif",
        padding: '24px',
      }}
    >
      {/* Wrapper to stack the back button above the form card */}
      <div style={{ maxWidth: '380px', width: '100%' }}>

        {/* ⬅️ "Back to landing" button on its own line above the card */}
        <div style={{ marginBottom: '16px', textAlign: 'left' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#f3e6c8',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: 600,
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Back to landing
          </button>
        </div>

        {/* Main Admin Card */}
        <div
          style={{
            width: '100%',
            padding: '40px 36px',
            backgroundColor: 'rgba(255, 251, 244, 0.97)',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            border: '1px solid rgba(201,162,39,0.35)',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}
          >
            <span style={{ width: '24px', height: '1px', background: '#c9a227', display: 'inline-block' }} />
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: '#8a2b3b',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Admin portal
            </span>
            <span style={{ width: '24px', height: '1px', background: '#c9a227', display: 'inline-block' }} />
          </div>

          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: '26px',
              color: '#3a0f18',
              margin: '6px 0 22px',
              textAlign: 'center',
            }}
          >
            Sign in
          </h2>

          {error && (
            <div
              style={{
                color: '#8a2b3b',
                backgroundColor: '#f6e4e6',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '18px',
                fontSize: '13.5px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 500,
                  fontSize: '13px',
                  color: '#5a4a3a',
                }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e8ddc8',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                  fontFamily: "'Work Sans', sans-serif",
                  outline: 'none',
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 500,
                  fontSize: '13px',
                  color: '#5a4a3a',
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e8ddc8',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                  fontFamily: "'Work Sans', sans-serif",
                  outline: 'none',
                }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '13px',
                backgroundColor: '#8a2b3b',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14.5px',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#711f2c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8a2b3b')}
            >
              Sign in
            </button>
          </form>

          <p style={{ marginTop: '24px', fontSize: '11px', color: '#b6a894', textAlign: 'center' }}>
            University of Colombo · est. 1921
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;