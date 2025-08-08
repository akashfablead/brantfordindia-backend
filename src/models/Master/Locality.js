const mongoose = require("mongoose");

const localitySchema = new mongoose.Schema({
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    microMarketId: { type: mongoose.Schema.Types.ObjectId, ref: "Micromarket", required: true },
    name: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

// Optional: unique constraint (name + microMarketId)
localitySchema.index({ microMarketId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Locality", localitySchema);
