const mongoose = require("mongoose");

const contactEnquirySchema = new mongoose.Schema({
    subject: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("ContactEnquiry", contactEnquirySchema);
