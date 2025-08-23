const FAQ = require("../models/FAQ");

// Add FAQ
// Add FAQ
const addFAQ = async (req, res) => {
    try {
        const { question, answer, faqType, propertyTypeId } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({ status: false, message: "Question is required" });
        }
        if (!answer || !answer.trim()) {
            return res.status(400).json({ status: false, message: "Answer is required" });
        }

        let faqData = {
            question: question.trim(),
            answer: answer.trim(),
            faqType: faqType || "general"
        };

        if (faqType === "typeWise") {
            if (!propertyTypeId) {
                return res.status(400).json({ status: false, message: "PropertyTypeId is required for typeWise FAQ" });
            }
            faqData.propertyType = propertyTypeId;
        }

        const faq = await FAQ.create(faqData);
        res.json({ status: true, message: "FAQ added successfully", faq });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Edit FAQ
// Edit FAQ
const editFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, faqType, propertyTypeId } = req.body;

        const faq = await FAQ.findById(id);
        if (!faq) {
            return res.status(404).json({ status: false, message: "FAQ not found" });
        }

        if (question) faq.question = question.trim();
        if (answer) faq.answer = answer.trim();
        if (faqType) faq.faqType = faqType;

        if (faqType === "typeWise") {
            if (!propertyTypeId) {
                return res.status(400).json({ status: false, message: "PropertyTypeId is required for typeWise FAQ" });
            }
            faq.propertyType = propertyTypeId;
        } else {
            faq.propertyType = null; // reset if it's general
        }

        await faq.save();
        res.json({ status: true, message: "FAQ updated successfully", faq });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// Get All FAQs
// Get All FAQs
const getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find()
            .populate("propertyType", "name unitOfMeasurement")
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for plain JS objects;

        res.json({ status: true, message: "FAQs fetched successfully", faqs });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// Get FAQ by ID
const getFAQById = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await FAQ.findById(id)
            .populate("propertyType", "name unitOfMeasurement")
            .lean();

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
