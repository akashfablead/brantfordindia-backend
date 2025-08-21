const mongoose = require("mongoose");

const propertyEnquiryListSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true }, // linked property
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    seatsReq: { type: Number, required: true },
    status: { type: String, enum: ["active", "closed"], default: "active" }, // track active enquiries
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("PropertyEnquiry", propertyEnquiryListSchema);
