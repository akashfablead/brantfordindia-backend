const FooterLinkMicroMarketFaq = require("../models/FooterLinkMicroMarketFaq");

// Add
const addFooterLinkMicroMarketFaq = async (req, res) => {
    try {
        const { FooterLinkMicroMarket, FooterLink, question, answer } = req.body;

        if (!FooterLinkMicroMarket || !FooterLink || !question || !answer) {
            return res.status(400).json({ status: false, message: "Category and questions/answers are required" });
        }

        const questionsArr = Array.isArray(question) ? question : [question];
        const answersArr = Array.isArray(answer) ? answer : [answer];

        if (questionsArr.length !== answersArr.length) {
            return res.status(400).json({ status: false, message: "Questions and answers count must match" });
        }

        const faqs = questionsArr.map((q, idx) => ({
            question: q,
            answer: answersArr[idx]
        }));

        const newFaq = new FooterLinkMicroMarketFaq({ FooterLinkMicroMarket, FooterLink, faqs });
        await newFaq.save();

        res.json({ status: true, message: "Footer Link Micro Market FAQ added successfully", data: newFaq });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Edit
const editFooterLinkMicroMarketFaq = async (req, res) => {
    try {
        const { id } = req.params;

        let faqArray = [];

        if (req.body.question && req.body.answer) {
            const questions = Array.isArray(req.body.question) ? req.body.question : [req.body.question];
            const answers = Array.isArray(req.body.answer) ? req.body.answer : [req.body.answer];

            faqArray = questions.map((q, index) => ({
                question: q,
                answer: answers[index] || ""
            }));
        }

        const updated = await FooterLinkMicroMarketFaq.findByIdAndUpdate(
            id,
            { faqs: faqArray },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ status: false, message: "Not found" });
        }

        res.json({ status: true, message: "Updated successfully", data: updated });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get All
const getFooterLinkMicroMarketFaqs = async (req, res) => {
    try {
        const faqs = await FooterLinkMicroMarketFaq.find()
            .populate("FooterLink", "title")
            .populate("FooterLinkMicroMarket", "name")
            .sort({ createdAt: -1 });

        res.json({ status: true, message: "Footer Link Micro Market FAQs fetched successfully", data: faqs });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get By ID
const getFooterLinkMicroMarketFaqById = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await FooterLinkMicroMarketFaq.findById(id)
            .populate("FooterLink", "title")
            .populate("FooterLinkMicroMarket", "name");

        if (!faq) return res.status(404).json({ status: false, message: "Not found" });

        res.json({ status: true, message: "Footer Link Micro Market FAQ fetched successfully", data: faq });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Delete
const deleteFooterLinkMicroMarketFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await FooterLinkMicroMarketFaq.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ status: false, message: "Not found" });

        res.json({ status: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Delete FAQ by Index
const deleteMicroMarketFAQSbyIndex = async (req, res) => {
    try {
        const { id, index } = req.params;

        const faqEntry = await FooterLinkMicroMarketFaq.findById(id);
        if (!faqEntry) return res.status(404).json({ status: false, message: "Entry not found" });

        if (index < 0 || index >= faqEntry.faqs.length) {
            return res.status(400).json({ status: false, message: "Invalid index" });
        }

        faqEntry.faqs.splice(index, 1);
        await faqEntry.save();

        res.json({ status: true, message: "FAQ removed successfully", data: faqEntry });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    addFooterLinkMicroMarketFaq,
    editFooterLinkMicroMarketFaq,
    getFooterLinkMicroMarketFaqs,
    getFooterLinkMicroMarketFaqById,
    deleteFooterLinkMicroMarketFaq,
    deleteMicroMarketFAQSbyIndex
};
