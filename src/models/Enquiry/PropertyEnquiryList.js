const mongoose = require("mongoose");

const propertyEnquiryListSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    seatsReq: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("PropertyEnquiry", propertyEnquiryListSchema);
