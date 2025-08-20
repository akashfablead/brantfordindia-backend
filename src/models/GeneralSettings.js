const mongoose = require("mongoose");

const whyChooseSchema = new mongoose.Schema({
    icon: { type: String }, // file path or URL
    title: { type: String, required: true },
    description: { type: String }
}, { _id: false });

const generalSettingsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["home", "about_us", "terms_conditions", "policy_content", "brandford_information", "why_choose"],
        required: true
    },

    // Home
    homepageSections: { type: String },
    homePageTitle: { type: String },
    homePageBanner: { type: String },

    // About Us
    aboutUsImage: { type: String },
    aboutUsContent: { type: String },

    // Terms & Conditions
    termsConContent: { type: String },

    // Policy Content
    policyContent: { type: String },

    // Brandford Information
    brandfordContent: { type: String },

    // Why Choose Workspace
    whyChoose: [whyChooseSchema]

}, { timestamps: true });

module.exports = mongoose.model("GeneralSettings", generalSettingsSchema);
