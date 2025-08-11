// src/controllers/contactUsController.js

const ContactUs = require("../../models/Master/ContactUs");


// Add Contact - only one allowed
const addContact = async (req, res) => {
    try {
        const existingContact = await ContactUs.findOne();
        if (existingContact) {
            return res.status(400).json({ status: false, message: "Contact info already exists. Please update instead." });
        }

        const { address, email, phone, location } = req.body;
        const newContact = await ContactUs.create({ address, email, phone, location });

        res.status(201).json({ status: true, message: "Contact added successfully", contact: newContact });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Edit Contact - always updates the first one
// Edit Contact - always updates the first one, auto-create if not found
const editContact = async (req, res) => {
    try {
        const { address, email, phone, location } = req.body;

        // Try to update the existing contact
        let updatedContact = await ContactUs.findOneAndUpdate(
            {},
            { address, email, phone, location },
            { new: true, runValidators: true }
        );

        // If no contact found, create a new one (empty or with provided data)
        if (!updatedContact) {
            updatedContact = await ContactUs.create({
                address: address || "",
                email: email || "",
                phone: phone || "",
                location: location || ""
            });

            return res.status(201).json({
                status: true,
                message: "No existing contact found — created new contact",
                contact: updatedContact
            });
        }

        res.json({
            status: true,
            message: "Contact updated successfully",
            contact: updatedContact
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// Get Contact
const getContact = async (req, res) => {
    try {
        let contact = await ContactUs.findOne();

        // If no contact exists, return empty object but still success
        if (!contact) {
            return res.json({
                status: true,
                message: "No contact info found — returning empty data",
                contact: {}
            });
        }

        res.json({
            status: true,
            message: "Contact fetched successfully",
            contact
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// Delete Contact
const deleteContact = async (req, res) => {
    try {
        const deletedContact = await ContactUs.findOneAndDelete();
        if (!deletedContact) {
            return res.status(404).json({ status: false, message: "No contact info found to delete" });
        }
        res.json({ status: true, message: "Contact deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    addContact,
    editContact,
    getContact,
    deleteContact
};
