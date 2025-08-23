const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
    {
        faqType: { type: String, enum: ["general", "typeWise"], default: "general" },
        propertyType: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyType", default: null },
        question: { type: String, required: true, trim: true },
        answer: { type: String, required: true, trim: true },

    },
    { timestamps: true }
);

module.exports = mongoose.model("FAQ", faqSchema);
