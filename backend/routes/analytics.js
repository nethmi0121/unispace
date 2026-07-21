const express = require('express');
const router = express.Router();
const UsageLog = require('../models/UsageLog');

// GET /api/analytics/peak-hours
router.get('/peak-hours', async (req, res) => {
  try {
    // This is your specialized MongoDB Aggregation Pipeline
    const peakHoursData = await UsageLog.aggregate([
      {
        // 1. Group the logs by the hour extraction of the timestamp
        $group: {
          _id: { $hour: "$timestamp" }, // Extracts integer from 0 to 23
          count: { $sum: 1 }            // Counts how many check-ins/outs happened in that hour
        }
      },
      {
        // 2. Sort chronologically from 12 AM (0) to 11 PM (23)
        $sort: { "_id": 1 }
      },
      {
        // 3. Reshape the keys so it's clean and easy for your React graph to read
        $project: {
          _id: 0,
          hour: { $concat: [ { $toString: "$_id" }, ":00" ] },
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