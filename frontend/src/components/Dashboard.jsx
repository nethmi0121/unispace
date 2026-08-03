import React from 'react';
import AnalyticsDashboard from '../AnalyticsDashboard'; 
import '../styles/StudentRoom.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🏫 Student Live Analytics</h1>
        <p>Real-time campus peak hours & occupancy trends</p>
      </header>

      {/* Pure Analytics View */}
      <section className="analytics-section">
        <AnalyticsDashboard />
      </section>
    </div>
  );
};

export default Dashboard;