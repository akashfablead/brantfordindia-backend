const mongoose = require("mongoose");

const footerLinkSchema = new mongoose.Schema({
    propertyType: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyType", required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true, trim: true },
    galleryImages: [{ type: String }], // file upload paths
    galleryUrls: [{ type: String }],   // external URLs    slug: { type: String, required: true, unique: true },
    footerContent: { type: String },
    rssFeed: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("FooterLink", footerLinkSchema);
