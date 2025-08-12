const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
});

const footerLinkMicroMarketFaqSchema = new mongoose.Schema({
    FooterLink: { type: mongoose.Schema.Types.ObjectId, ref: "FooterLink", required: true },
    FooterLinkMicroMarket: { type: mongoose.Schema.Types.ObjectId, ref: "Micromarket", required: true },
    faqs: [faqSchema],
}, { timestamps: true });

module.exports = mongoose.model("FooterLinkMicroMarketFaq", footerLinkMicroMarketFaqSchema);
