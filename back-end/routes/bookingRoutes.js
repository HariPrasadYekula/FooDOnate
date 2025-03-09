const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/Booking');

// Middleware for ID validation
const validateId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    next();
};

// Endpoint to create a new booking with validation
router.post('/add', [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('phone').not().isEmpty().withMessage('Phone number is required'),
    check('eventDate').not().isEmpty().withMessage('Event date is required'),
    check('numberOfPeople').isInt().withMessage('Number of people must be a number')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ success: true, message: 'Booking created successfully!', data: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint to get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint to get a specific booking by ID
router.get('/:id', validateId, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint to update a booking by ID
router.put('/:id', validateId, async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, data: updatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint to delete a booking by ID
router.delete('/:id', validateId, async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
