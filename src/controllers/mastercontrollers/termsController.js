// src/controllers/termsController.js
const Terms = require("../../models/Master/Terms");

// Add or Update Terms
const addOrUpdateTerms = async (req, res) => {
    try {
        let { content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ status: false, message: "Content is required" });
        }

        const terms = await Terms.findOneAndUpdate(
            {},
            { content: content.trim() },
            { new: true, upsert: true }
        );

        res.json({ status: true, message: "Terms updated successfully", terms: terms });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get Terms
const getTerms = async (req, res) => {
    try {
        const terms = await Terms.findOne();
        res.json({
            status: true,
            message: "Terms fetched successfully",
            terms: terms
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


module.exports = {
    addOrUpdateTerms,
    getTerms
};
