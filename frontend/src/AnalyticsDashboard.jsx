import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsDashboard = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Get auth token from localStorage if your app stores it there (e.g., 'token' or 'userToken')
      const token = localStorage.getItem('token'); 

      const response = await fetch('http://localhost:5000/api/analytics/peak-hours', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }), // Include token if present
        },
      });

      if (response.status === 401) {
        throw new Error('401 Unauthorized: Please log in to view analytics.');
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // Ensure data is strictly an array to keep Recharts happy
      if (Array.isArray(data)) {
        setTrafficData(data);
      } else if (Array.isArray(data?.data)) {
        setTrafficData(data.data);
      } else {
        setTrafficData([]);
      }

    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.message || 'Failed to load analytics.');
      setTrafficData([]); // Ensure trafficData remains an array on failure
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading campus analytics...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: '#e74c3c', textAlign: 'center' }}>⚠️ {error}</div>;
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h2 style={{ color: '#333', marginBottom: '5px' }}>📊 Campus Foot-Traffic Trends</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Real-time historical transaction logs aggregated by peak hours</p>
      
      <div style={{ width: '100%', height: 400, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" stroke="#888888" fontSize={12} />
            <YAxis stroke="#888888" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }} />
            <Line type="monotone" dataKey="totalTraffic" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} name="Total Traffic Actions" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;