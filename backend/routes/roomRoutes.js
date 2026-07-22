const express = require("express");

const router = express.Router();

const {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom,
  resetCount,
} = require("../controllers/roomController");

router.post("/", createRoom);

router.get("/", getRooms);

router.put("/:id", updateRoom);

router.delete("/:id", deleteRoom);

router.put("/reset/:id", resetCount);

module.exports = router;