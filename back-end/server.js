require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');  // Import cors

const donationRoutes = require('./routes/donationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());  // Enable CORS for all routes

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Body parser middleware to handle JSON requests
app.use(bodyParser.json());

// Routes
app.use('/donations', donationRoutes);  // Correctly maps to '/donations' path
app.use('/bookings', bookingRoutes);
app.use('/contacts', contactRoutes);

// MongoDB Connection (Updated)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
