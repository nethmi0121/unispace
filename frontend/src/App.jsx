import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import StudentPortal from './components/StudentPortal';
import AdminConsole from './components/AdminDashboard';
import Login from './components/Login'; // 👈 1. Import your new Login component
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 👈 2. Track authentication state by checking if a token exists in the browser
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from storage
    setIsAdminAuthenticated(false);   // Boot them out to the login screen state
    setActiveTab('dashboard');        // Optional: redirect to main dashboard on logout
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-section">
          <h2>UniSpace 🚀</h2>
          <span className="user-badge">Team Lead Workspace</span>
        </div>
        <nav className="nav-menu">
          <button 
            className={activeTab === 'dashboard' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard Tracker
          </button>
          <button 
            className={activeTab === 'student-dashboard' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('student-dashboard')}
          >
            🎓 Student Portal
          </button>
          <button 
            className={activeTab === 'admin' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('admin')}
          >
            ⚙️ Admin Console
          </button>
        </nav>
      </aside>

      {/* Main Content Viewport */}
      <main className="main-content">
        <header className="top-bar">
          <h1>{activeTab.replace('-', ' ').toUpperCase()}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* 👈 3. If they are an authenticated admin, show a logout button in the header */}
            {isAdminAuthenticated && activeTab === 'admin' && (
              <button 
                onClick={handleLogout} 
                style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
              >
                Logout
              </button>
            )}
            <div className="system-status">
              <span className="status-dot online"></span> Backend Cloud Connected
            </div>
          </div>
        </header>

        <section className="content-body">
          {/* Dynamically rendering components based on state */}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'student-dashboard' && <StudentPortal />}
          
          {/* 👈 4. Smart Conditional Rendering for Admin Console */}
          {activeTab === 'admin' && (
            isAdminAuthenticated ? (
              <AdminConsole />
            ) : (
              <Login onLoginSuccess={() => setIsAdminAuthenticated(true)} />
            )
          )}
        </section>
      </main>
    </div>
  );
}

export default App;