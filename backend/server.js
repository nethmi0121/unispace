const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth'); 
const studentAuthRoutes = require('./routes/studentAuth'); // 👈 1. Import student auth
const authMiddleware = require('./middleware/auth');
const roomRoutes = require('./routes/roomRoutes');

dotenv.config();

const app = express();

app.use(cors());          
app.use(express.json());     

app.use('/api/auth', authRoutes); // Admin auth
app.use('/api/student-auth', studentAuthRoutes); // 👈 2. Mount student auth
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/rooms', roomRoutes); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("Database connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running cleanly on port ${PORT}`);
});