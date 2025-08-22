const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        category: { type: mongoose.Schema.Types.ObjectId, ref: "BlogCategory", required: true },
        tag: { type: mongoose.Schema.Types.ObjectId, ref: "BlogTag", required: true },

        title: { type: String, required: true, trim: true },
        image: { type: String, required: true },
        imageTag: { type: String, trim: true },

        shortDescription: { type: String, required: true, trim: true },
        longDescription: { type: String, required: true, trim: true },

        pageTitle: { type: String, trim: true },
        slug: { type: String, unique: true, required: true, trim: true },

        status: { type: String, enum: ["active", "inactive"], default: "active" },
        rssFeed: { type: String, trim: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
