const mongoose = require("mongoose");

const generalSettingsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["home", "about_us", "terms_conditions", "policy_content", "brandford_information"],
        required: true
    },

    // Home
    homepageSections: { type: String },
    homePageTitle: { type: String },
    homePageBanner: { type: String }, // file path or URL

    // About Us
    aboutUsImage: { type: String },
    aboutUsContent: { type: String },

    // Terms & Conditions
    termsConContent: { type: String },

    // Policy Content
    policyContent: { type: String },

    // Brandford Information
    brandfordContent: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("GeneralSettings", generalSettingsSchema);
