const mongoose = require("mongoose");

const postRequirementSchema = new mongoose.Schema({
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        required: true
    },
    propertyType: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyType", required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    companyName: { type: String, required: true },
    number: { type: String, required: true },
    teamSize: {
        type: String,
        enum: ["1-20", "21-40", "41-60", "61-80"],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("PostRequirement", postRequirementSchema);
