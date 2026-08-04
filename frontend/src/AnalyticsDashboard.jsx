import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FONT_IMPORT_ID = "unispace-fonts";

function ensureFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById(FONT_IMPORT_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_IMPORT_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&family=Work+Sans:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

const AnalyticsDashboard = () => {
  const [rawData, setRawData] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ensureFonts();
    fetchAnalyticsData();
    fetchAllRooms();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/analytics/peak-hours', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setRawData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRooms = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/rooms', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      const rooms = Array.isArray(result) ? result : (result.data || []);

      const names = rooms.map((r) => r.roomName || r.name).filter(Boolean);
      setAllRooms(names);
    } catch (err) {
      console.error('Error fetching room list:', err);
    }
  };

  // Extract rooms cleanly
  const uniqueRooms = Array.from(
    new Set([
      ...allRooms,
      ...rawData
        .map((item) => item.roomName || item.room || item.locationHub)
        .filter(Boolean),
    ])
  );

  const parseHourInt = (hourStr) => parseInt(hourStr, 10) || 0;

  const getProcessedChartData = () => {
    let processed = [];

    if (selectedRoom === 'ALL') {
      const hourlyMap = {};
      rawData.forEach((item) => {
        hourlyMap[item.hour] = (hourlyMap[item.hour] || 0) + item.totalTraffic;
      });
      processed = Object.keys(hourlyMap).map((hour) => ({
        hour,
        totalTraffic: hourlyMap[hour],
      }));
    } else {
      // 💡 Case-insensitive matching to prevent case mismatches from hiding data
      processed = rawData.filter((item) => {
        const itemRoom = (item.roomName || item.room || item.locationHub || "").toString().trim().toLowerCase();
        const targetRoom = selectedRoom.toString().trim().toLowerCase();
        return itemRoom === targetRoom;
      });
    }

    return processed.sort((a, b) => parseHourInt(a.hour) - parseHourInt(b.hour));
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#8a7a68', fontFamily: "'Work Sans', sans-serif" }}>
        Loading campus analytics…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#8a2b3b', fontFamily: "'Work Sans', sans-serif" }}>
        {error}
      </div>
    );
  }

  const chartData = getProcessedChartData();

  return (
    <div
      style={{
        padding: '32px',
        fontFamily: "'Work Sans', sans-serif",
        backgroundColor: '#fbf7ef',
        borderRadius: '14px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}
          >
            <span style={{ width: '20px', height: '1px', background: '#c9a227', display: 'inline-block' }} />
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: '#8a2b3b',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Campus analytics
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              color: '#3a0f18',
              margin: 0,
              fontSize: '1.5rem',
            }}
          >
            Peak hours by room
          </h2>
          <p style={{ color: '#9a8b78', margin: '6px 0 0 0', fontSize: '13.5px' }}>
            Historical transaction activity aggregated by peak hour
          </p>
        </div>

        <div>
          <label
            style={{
              fontWeight: 600,
              marginRight: '10px',
              color: '#5a4a3a',
              fontSize: '13px',
            }}
          >
            Filter room
          </label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '7px',
              border: '1px solid #e8ddc8',
              fontWeight: 600,
              fontSize: '13.5px',
              cursor: 'pointer',
              backgroundColor: '#fff',
              color: '#3a0f18',
              fontFamily: "'Work Sans', sans-serif",
            }}
          >
            <option value="ALL">All rooms (campus total)</option>
            {uniqueRooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          height: 400,
          backgroundColor: '#fff',
          padding: '22px',
          borderRadius: '12px',
          boxShadow: '0 3px 10px rgba(58, 15, 24, 0.06)',
          border: '1px solid #f0e6d2',
          boxSizing: 'border-box',
        }}
      >
        {chartData.length === 0 ? (
          <div
            style={{
              display: 'flex',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#b6a894',
              fontSize: '14px',
            }}
          >
            No usage logs recorded for this selection yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e6d2" />
              <XAxis dataKey="hour" stroke="#b6a894" fontSize={12} />
              <YAxis stroke="#b6a894" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fffbf4',
                  border: '1px solid #c9a227',
                  borderRadius: '8px',
                  fontFamily: "'Work Sans', sans-serif",
                  fontSize: '13px',
                }}
              />
              <Line
                type="monotone"
                dataKey="totalTraffic"
                stroke="#8a2b3b"
                strokeWidth={3}
                dot={{ fill: '#c9a227', r: 3 }}
                activeDot={{ r: 7, fill: '#8a2b3b' }}
                name={selectedRoom === 'ALL' ? 'Total campus traffic' : `${selectedRoom} traffic`}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;