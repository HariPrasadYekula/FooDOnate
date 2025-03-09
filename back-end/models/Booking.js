const mongoose = require('mongoose');

// Define the schema for a Booking
const BookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    numberOfPeople: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    }
});

// Create and export the Booking model based on the schema
module.exports = mongoose.model('Booking', BookingSchema);
