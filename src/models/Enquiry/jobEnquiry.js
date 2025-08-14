// models/jobEnquiry.js
const mongoose = require("mongoose");

const jobEnquirySchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobPost", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    coverLetter: { type: String, required: true },
    cv: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("JobEnquiry", jobEnquirySchema);
