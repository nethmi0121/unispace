import React, { useState } from 'react';

const StudentLogin = ({ onLoginSuccess, onBack }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/student-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('studentToken', data.token);
        localStorage.setItem('studentId', data.studentId);
        onLoginSuccess();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to authentication server');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginBottom: '15px' }}>
        ← Back to Landing
      </button>
      <h2 style={{ textAlign: 'center', color: '#2563eb', marginBottom: '20px' }}>🎓 Student Login</h2>
      {error && <div style={{ color: 'red', backgroundColor: '#fde8e8', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Student ID / Index No.</label>
          <input 
            type="text" 
            value={studentId} 
            onChange={(e) => setStudentId(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            required 
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            required 
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default StudentLogin;