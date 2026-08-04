import React, { useState } from 'react';
import AdminDashboard from '../AdminDashboard';
import AdminDoorQRPage from '../AdminDoorQRPage'; // Import new QR page
import Login from '../AdminLogin';
import '../../styles/PortalNavbar.css';

function AdminLayout({ isAuthenticated, onLoginSuccess, onLogout, onHomeClick }) {
  // Navigation state inside Admin: 'dashboard' | 'door-qrs'
  const [adminView, setAdminView] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login onLoginSuccess={onLoginSuccess} />;
  }

  return (
    <>
      {/* Admin Navigation Bar */}
      <div className="portal-navbar">
        <div className="nav-left">
          <button className="home-btn" onClick={onHomeClick}>
            Home
          </button>
          <h2>Admin portal</h2>
        </div>

        {/* Navigation Tabs */}
        <div className="portal-tabs">
          <button
            className={`tab-btn ${adminView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setAdminView('dashboard')}
          >
            Manage rooms
          </button>

          <button
            className={`tab-btn ${adminView === 'door-qrs' ? 'active' : ''}`}
            onClick={() => setAdminView('door-qrs')}
          >
            Room door QRs
          </button>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Render selected Admin View */}
      {adminView === 'dashboard' && <AdminDashboard />}
      {adminView === 'door-qrs' && <AdminDoorQRPage onBack={() => setAdminView('dashboard')} />}
    </>
  );
}

export default AdminLayout;