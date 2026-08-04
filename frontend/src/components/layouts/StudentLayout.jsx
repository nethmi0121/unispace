import React from 'react';
import StudentPortal from '../StudentPortal';
import StudentLogin from '../StudentLogin';
import '../../styles/PortalNavbar.css';

function StudentLayout({ isAuthenticated, onLoginSuccess, onLogout, onHomeClick }) {
  if (!isAuthenticated) {
    return <StudentLogin onLoginSuccess={onLoginSuccess} onBack={onHomeClick} />;
  }

  return (
    <>
      <div className="portal-navbar">
        <button className="home-btn" onClick={onHomeClick}>
          Home
        </button>
        <h2>Student portal</h2>
        <button className="logout-btn" onClick={onLogout}>
          Logout ({localStorage.getItem("studentId") || "Student"})
        </button>
      </div>
      <StudentPortal />
    </>
  );
}

export default StudentLayout;