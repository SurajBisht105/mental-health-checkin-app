const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Update CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://mental-health-frontend.vercel.app', // Your frontend URL
    process.env.CLIENT_URL
  ],
  credentials: true
};

app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mental Health API is running!',
    endpoints: {
      auth: '/api/auth',
      checkins: '/api/checkins'
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/checkins', checkinRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Export for Vercel
module.exports = app;
