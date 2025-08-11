const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
    jobCategory: { type: mongoose.Schema.Types.ObjectId, ref: "JobCategory", required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["part-time", "full-time"], required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("JobPost", jobPostSchema);
