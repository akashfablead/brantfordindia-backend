const mongoose = require("mongoose");

const LogoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true }  
}, { timestamps: true });

module.exports = mongoose.model("Logo", LogoSchema);
