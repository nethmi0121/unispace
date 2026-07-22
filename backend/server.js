const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth'); 
const authMiddleware = require('./middleware/auth');
const studentRoutes = require('./routes/studentRoutes');

dotenv.config();

const app = express();

app.use(cors());            
app.use(express.json());     

app.use('/api/auth', authRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/rooms', studentRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("Database connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running cleanly on port ${PORT}`);
});