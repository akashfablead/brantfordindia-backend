const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("BlogCategory", blogCategorySchema);
