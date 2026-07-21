import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsDashboard = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the structured JSON data from your backend route
    fetch('http://localhost:5000/api/analytics/peak-hours')
      .then((res) => res.json())
      .then((data) => {
        setTrafficData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching analytics data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading campus analytics...</div>;
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h2 style={{ color: '#333', marginBottom: '5px' }}>📊 Campus Foot-Traffic Trends</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Real-time historical transaction logs aggregated by peak hours</p>
      
      <div style={{ width: '100%', height: 400, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            {/* Maps the 'hour' key to the horizontal axis */}
            <XAxis dataKey="hour" stroke="#888888" fontSize={12} />
            {/* Maps the total events count to the vertical axis */}
            <YAxis stroke="#888888" fontSize={12} />
            {/* Creates interactive hover effect cards */}
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }} />
            {/* Draws the dynamic trend line matching your database metrics */}
            <Line type="monotone" dataKey="totalTraffic" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} name="Total Traffic Actions" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;