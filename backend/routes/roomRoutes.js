const express = require("express");
const router = express.Router();

const {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom,
  resetCount,
  checkInRoom,
  checkOutRoom
} = require("../controllers/roomController");

router.post("/", createRoom);
router.get("/", getRooms);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);
router.put("/reset/:id", resetCount);

// 👇 Student Check-in & Check-out routes
router.post("/:id/checkin", checkInRoom);
router.post("/:id/checkout", checkOutRoom);

module.exports = router;