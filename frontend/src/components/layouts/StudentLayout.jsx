import React from 'react';
import StudentPortal from '../StudentPortal';
import StudentLogin from '../StudentLogin';

function StudentLayout({ isAuthenticated, onLoginSuccess, onLogout, onHomeClick }) {
  if (!isAuthenticated) {
    return <StudentLogin onLoginSuccess={onLoginSuccess} onBack={onHomeClick} />;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#2563eb', color: 'white' }}>
        <button onClick={onHomeClick} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
          🏠 Home
        </button>
        <h2 style={{ margin: 0 }}>🎓 Student Portal</h2>
        <button onClick={onLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout ({localStorage.getItem("studentId") || "Student"})
        </button>
      </div>
      <StudentPortal />
    </>
  );
}

export default StudentLayout;