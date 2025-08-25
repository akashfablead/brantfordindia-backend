const mongoose = require("mongoose");

const unitTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    propertyType: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyType", required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("UnitType", unitTypeSchema);
