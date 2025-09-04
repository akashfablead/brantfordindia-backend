// models/Package.js
const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // Example: WhatsApp Credits
        category: {
            type: String,
            enum: ["whatsapp", "sms", "ai", "costemized"],
            required: true,
        },
        description: { type: String },
        price: { type: Number, required: true },
        credits: { type: Number, required: true },
        status: { type: String, enum: ["active", "inactive", "pending"], default: "pending" },
    },
    { timestamps: true }
);

// ✅ Prevent duplicate (name + category)
packageSchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Package", packageSchema);
