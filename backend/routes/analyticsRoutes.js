const express = require('express');
const router = express.Router();
// Import the controller functions
const { getLogs, createLog } = require('../controllers/analyticsController');

// Map the endpoints directly to the controller functions
router.get('/logs', getLogs);
router.post('/log', createLog);

module.exports = router;