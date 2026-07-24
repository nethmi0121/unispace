const mongoose = require('mongoose');
const dotenv = require('dotenv');
const UsageLog = require('./models/UsageLog');

dotenv.config();

const simulateData = async () => {
  try {
    // 1. Connect to your cloud MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected for simulation...");

    // Clear out any old logs so we start completely fresh
    await UsageLog.deleteMany({});

    const sampleRooms = ['Main Library', 'Study Lab A', 'Discussion Room 2'];
    const fakeLogs = [];

    // 2. Generate 500 fake tracking events
    for (let i = 0; i < 500; i++) {
      // Pick a random room and action
      const randomRoom = sampleRooms[Math.floor(Math.random() * sampleRooms.length)];
      const randomAction = Math.random() > 0.4 ? 'check-in' : 'check-out';
      
      // Create a random time over the last 24 hours
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

    // 3. Bulk insert everything into your cloud cluster
    await UsageLog.insertMany(fakeLogs);
    console.log("🚀 Success! 500 simulated timestamps successfully added to MongoDB!");
    
    process.exit();
  } catch (error) {
    console.error("Simulation failed:", error);
    process.exit(1);
  }
};

simulateData();