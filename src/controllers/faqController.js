const FAQ = require("../models/FAQ");

// Add FAQ
const addFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({ status: false, message: "Question is required" });
        }
        if (!answer || !answer.trim()) {
            return res.status(400).json({ status: false, message: "Answer is required" });
        }

        const faq = await FAQ.create({ question: question.trim(), answer: answer.trim() });
        res.json({ status: true, message: "FAQ added successfully", faq });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Edit FAQ
const editFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;

        const faq = await FAQ.findById(id);
        if (!faq) {
            return res.status(404).json({ status: false, message: "FAQ not found" });
        }

        if (question) faq.question = question.trim();
        if (answer) faq.answer = answer.trim();

        await faq.save();
        res.json({ status: true, message: "FAQ updated successfully", faq });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get All FAQs
const getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find().sort({ createdAt: -1 });
        res.json({ status: true, message: "FAQs fetched successfully", faqs });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get FAQ by ID
const getFAQById = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await FAQ.findById(id);
        if (!faq) {
            return res.status(404).json({ status: false, message: "FAQ not found" });
        }
        res.json({ status: true, message: "FAQ fetched successfully", faq });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Delete FAQ
const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await FAQ.findById(id);
        if (!faq) {
            return res.status(404).json({ status: false, message: "FAQ not found" });
        }

        await faq.deleteOne();
        res.json({ status: true, message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    addFAQ,
    editFAQ,
    getAllFAQs,
    getFAQById,
    deleteFAQ
};
