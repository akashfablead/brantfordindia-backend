// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" }, // ✅ Changed from PackageId to packageId
    amount: Number,
    status: String,
    razorpayId: String,
    paymentDate: Date,
    creditsTransferred: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
