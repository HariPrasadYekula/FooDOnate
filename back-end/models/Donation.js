const mongoose = require('mongoose');

// Define the schema for a Donation
const DonationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Donation model based on the schema
module.exports = mongoose.model('Donation', DonationSchema);
