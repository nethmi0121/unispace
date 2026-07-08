import React from 'react';

function Dashboard() {
  return (
    <div className="card shadow-sm animate-fade-in">
      <h3>Background Activity Analytics</h3>
      <p className="text-muted">Monitoring real-time check-ins, check-outs, and workspace history logs.</p>
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>0</h4>
          <p>Active Students</p>
        </div>
        <div className="metric-card">
          <h4>0</h4>
          <p>Total Events Today</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;