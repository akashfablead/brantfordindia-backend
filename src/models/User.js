// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: String },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user", required: true },
    profileImage: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    loginProvider: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);
