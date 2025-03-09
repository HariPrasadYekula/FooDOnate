const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const router = express.Router();
const Donation = require('../models/Donation');

const validateId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    next();
};

// Endpoint to add a new donation with validation
router.post('/add', [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('type').not().isEmpty().withMessage('Donation type is required'),
    check('quantity').isInt().withMessage('Quantity must be a number')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const newDonation = new Donation(req.body);
        await newDonation.save();
        res.status(201).json({ success: true, message: 'Donation added successfully!', data: newDonation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint to get all donations
router.get('/', async (req, res) => {
    try {
        const donations = await Donation.find();
        res.json({ success: true, data: donations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint to get a specific donation by ID
router.get('/:id', validateId, async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        res.json({ success: true, data: donation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint to update a donation by ID
router.put('/:id', validateId, async (req, res) => {
    try {
        const updatedDonation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDonation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        res.json({ success: true, data: updatedDonation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Endpoint to delete a donation by ID
router.delete('/:id', validateId, async (req, res) => {
    try {
        const deletedDonation = await Donation.findByIdAndDelete(req.params.id);
        if (!deletedDonation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        res.json({ success: true, message: 'Donation deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
module.exports = router;