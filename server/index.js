const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorites');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://thimeshaA:uo7okiVdYwQbIgcq@geonest.cygwhme.mongodb.net/?retryWrites=true&w=majority&appName=GeoNest')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);

// Only start the server if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app; 