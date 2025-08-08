const mongoose = require("mongoose");

const AmenitySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        rankAmenity: { type: Number },
        image: { type: String },
        status: { type: String, enum: ["active", "inactive"], default: "active" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Amenity", AmenitySchema);
