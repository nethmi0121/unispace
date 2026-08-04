const express = require('express');
const router = express.Router();
const UsageLog = require('../models/UsageLog');

// GET /api/analytics/peak-hours
router.get('/peak-hours', async (req, res) => {
  try {
    const peakHoursData = await UsageLog.aggregate([
      // 1. Ensure roomName is never null/missing during grouping
      {
        $project: {
          timestamp: 1,
          roomName: { $ifNull: ["$roomName", "General Campus"] }
        }
      },
      // 2. Group by hour and sanitized room name
      {
        $group: {
          _id: {
            hour: { $hour: "$timestamp" },
            roomName: "$roomName"
          },
          count: { $sum: 1 }
        }
      },
      // 3. Sort chronologically by hour (0 to 23)
      {
        $sort: { "_id.hour": 1 }
      },
      // 4. Format payload for Recharts frontend
      {
        $project: {
          _id: 0,
          hour: { $concat: [{ $toString: "$_id.hour" }, ":00"] },
          roomName: "$_id.roomName",
          totalTraffic: "$count"
        }
      }
    ]);

    res.json(peakHoursData);
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({ message: "Server error calculating analytics" });
  }
});

module.exports = router;