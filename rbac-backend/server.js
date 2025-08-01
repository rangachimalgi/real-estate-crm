import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from "./routes/auth.js"
import './models/Role.js';

dotenv.config();
const app = express();

// FIX: Add this to parse JSON bodies
app.use(express.json());

// connect db
connectDB();

// Routes
app.use('/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('👋 Hello from server');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
