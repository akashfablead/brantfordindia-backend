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
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
    bio: { type: String, trim: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
    credits: {
        whatsapp: { type: Number, default: 0 },
        sms: { type: Number, default: 0 },
        ai: { type: Number, default: 0 },
        costemized: { type: Number, default: 0 },
    },
}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);
