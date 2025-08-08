const mongoose = require("mongoose");


const micromarketSchema = new mongoose.Schema({
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        required: true,
    },
    stateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, { timestamps: true });

module.exports = mongoose.model("Micromarket", micromarketSchema);
