const express = require('express');
const router = express.Router();
const { getRooms, checkInRoom, checkOutRoom } = require('../controllers/studentController');

// Define Room Endpoints
router.get('/', getRooms);
router.post('/:id/checkin', checkInRoom);
router.post('/:id/checkout', checkOutRoom);

module.exports = router;