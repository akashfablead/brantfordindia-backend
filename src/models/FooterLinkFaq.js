const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
});

const footerLinkFaqSchema = new mongoose.Schema({
    FooterLink: { type: mongoose.Schema.Types.ObjectId, ref: "FooterLink", required: true },
    faqs: [faqSchema],
}, { timestamps: true });

module.exports = mongoose.model("FooterLinkFaq", footerLinkFaqSchema);
