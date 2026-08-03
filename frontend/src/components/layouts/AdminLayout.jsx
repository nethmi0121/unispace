import React from 'react';
import AdminDashboard from '../AdminDashboard';
import Login from '../AdminLogin';

function AdminLayout({ isAuthenticated, onLoginSuccess, onLogout, onHomeClick }) {
  if (!isAuthenticated) {
    return <Login onLoginSuccess={onLoginSuccess} />;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#1e3a8a', color: 'white' }}>
        <button onClick={onHomeClick} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
          🏠 Home
        </button>
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
        <button onClick={onLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout
        </button>
      </div>
      <AdminDashboard />
    </>
  );
}

export default AdminLayout;