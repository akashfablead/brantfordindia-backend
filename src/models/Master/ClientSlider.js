const mongoose = require("mongoose");

const clientSliderSchema = new mongoose.Schema(
    {
        logo: { type: String, required: true }, // path to image
        altTag: { type: String, required: true },
        status: { type: String, enum: ["active", "inactive"], default: "active" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("ClientSlider", clientSliderSchema);
