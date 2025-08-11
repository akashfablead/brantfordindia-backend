const mongoose = require("mongoose");

const advertiseSchema = new mongoose.Schema({
    type: { type: String, required: true, trim: true },
    pageName: { type: String, required: true, trim: true },
    propertyType: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyType", required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Locality", required: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    image: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Advertise", advertiseSchema);
