// models/Testimonial.js
const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        position: { type: String, required: true },
        companyName: { type: String, required: true },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        image: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
