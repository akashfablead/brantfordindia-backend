const mongoose = require("mongoose");

const footerLinksMicroMarketSchema = new mongoose.Schema({
    FooterLink: { type: mongoose.Schema.Types.ObjectId, ref: "FooterLink", required: true },
    microMarket: { type: mongoose.Schema.Types.ObjectId, ref: "Micromarket", required: true },
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true, trim: true },
    galleryImages: [{ type: String }], // file upload paths
    galleryUrls: [{ type: String }],   // external URLs
    footerContent: { type: String },
    rssFeed: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("FooterLinksMicroMarket", footerLinksMicroMarketSchema);
