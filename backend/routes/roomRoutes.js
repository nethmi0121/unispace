const express = require("express");
const router = express.Router();

const {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom,
  resetCount,
  checkInRoom,
  checkOutRoom,
  getRoomQRCode,
  scanAndCheckIn,
  scanAndCheckOut
} = require("../controllers/roomController");

// CRUD Routes
router.post("/", createRoom);
router.get("/", getRooms);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);
router.put("/reset/:id", resetCount);

// Direct Backup Check-in/out
router.post("/:id/checkin", checkInRoom);
router.post("/:id/checkout", checkOutRoom);

// QR Code & TOTP Routes
router.get("/:id/qrcode", getRoomQRCode);
router.post("/:id/scan-checkin", scanAndCheckIn);
router.post("/:id/scan-checkout", scanAndCheckOut);

module.exports = router;