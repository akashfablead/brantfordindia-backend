// models/Package.js - Keep the same, but ensure the model name matches
const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
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

packageSchema.index({ name: 1, category: 1 }, { unique: true });

// ✅ Make sure this matches the ref in Payment schema
module.exports = mongoose.model("Package", packageSchema);
