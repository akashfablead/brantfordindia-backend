const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
    stateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    image: {
        type: String,
        default: null
    },
    footerDescription: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("City", citySchema);
