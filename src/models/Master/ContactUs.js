// src/models/ContactUs.js
const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("ContactUs", contactUsSchema);
