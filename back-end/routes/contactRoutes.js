const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const router = express.Router();
const Contact = require('../models/Contact');

const validateId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    next();
};

// Endpoint to send a contact message with validation
router.post('/send', [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('subject').not().isEmpty().withMessage('Subject is required'),
    check('message').not().isEmpty().withMessage('Message is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json({ success: true, message: 'Message sent successfully!', data: newContact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint to get all contact messages
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json({ success: true, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint to get a specific contact message by ID
router.get('/:id', validateId, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.json({ success: true, data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint to delete a contact message by ID
router.delete('/:id', validateId, async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
