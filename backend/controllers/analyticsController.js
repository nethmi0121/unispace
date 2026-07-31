const Log = require('../models/Log');

const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error fetching tracking analytics' });
  }
};

const createLog = async (req, res) => {
  try {
    const newLog = await Log.create(req.body);
    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getLogs,
  createLog
};