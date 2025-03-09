const mongoose = require('mongoose');

// Define the schema for a Contact message
const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Contact model based on the schema
module.exports = mongoose.model('Contact', ContactSchema);
