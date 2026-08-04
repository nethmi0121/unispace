const mongoose = require('mongoose');
const dotenv = require('dotenv');
const UsageLog = require('./models/UsageLog');
const Room = require('./models/Room');

dotenv.config();

const simulateData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected for simulation...");

    // Clear old logs without room names
    await UsageLog.deleteMany({});

    // Fetch existing rooms from Admin panel
    const dbRooms = await Room.find({});
    let sampleRooms = dbRooms.map(r => r.roomName || r.name).filter(Boolean);

    // If no rooms exist in Admin panel yet, use these sample rooms
    if (sampleRooms.length === 0) {
      sampleRooms = ['Main Library', 'Study Lab A', 'Discussion Room 2'];
    }

    console.log("Seeding data for rooms:", sampleRooms);

    const fakeLogs = [];

    for (let i = 0; i < 500; i++) {
      const randomRoom = sampleRooms[Math.floor(Math.random() * sampleRooms.length)];
      const randomAction = Math.random() > 0.4 ? 'check-in' : 'check-out';
      
      const randomHourOffset = Math.floor(Math.random() * 24);
      const fakeTime = new Date();
      fakeTime.setHours(fakeTime.getHours() - randomHourOffset);
      fakeTime.setMinutes(Math.floor(Math.random() * 60));

      fakeLogs.push({
        roomName: randomRoom,
        actionType: randomAction,
        timestamp: fakeTime
      });
    }

    await UsageLog.insertMany(fakeLogs);
    console.log("🚀 Success! Data successfully populated for rooms:", sampleRooms);
    
    process.exit();
  } catch (error) {
    console.error("Simulation failed:", error);
    process.exit(1);
  }
};

simulateData();