const FooterLinkFaq = require("../models/FooterLinkFaq");

// Add
const addFooterLinkFaq = async (req, res) => {
    try {
        const { FooterLink, question, answer } = req.body;

        if (!FooterLink || !question || !answer) {
            return res.status(400).json({ status: false, message: "Category and questions/answers are required" });
        }

        // Ensure arrays
        const questionsArr = Array.isArray(question) ? question : [question];
        const answersArr = Array.isArray(answer) ? answer : [answer];

        if (questionsArr.length !== answersArr.length) {
            return res.status(400).json({ status: false, message: "Questions and answers count must match" });
        }

        // Combine into objects
        const faqs = questionsArr.map((q, idx) => ({
            question: q,
            answer: answersArr[idx]
        }));

        const newFaq = new FooterLinkFaq({ FooterLink, faqs });
        await newFaq.save();

        res.json({ status: true, message: "Footer Link FAQ added successfully", data: newFaq });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// Edit
const editFooterLinkFaq = async (req, res) => {
    try {
        const { id } = req.params;

        let faqArray = [];

        // If question[] and answer[] are coming from form-data, they will be arrays
        if (req.body.question && req.body.answer) {
            const questions = Array.isArray(req.body.question) ? req.body.question : [req.body.question];
            const answers = Array.isArray(req.body.answer) ? req.body.answer : [req.body.answer];

            faqArray = questions.map((q, index) => ({
                question: q,
                answer: answers[index] || ""
            }));
        }

        const updated = await FooterLinkFaq.findByIdAndUpdate(
            id,
            { faqs: faqArray }, // assuming your model has `faqs: [{ question, answer }]`
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

const getFooterLinkFaqs = async (req, res) => {
    try {
        const faqs = await FooterLinkFaq.find()
            .populate("FooterLink", "title slug")
            .sort({ createdAt: -1 }); // populate hata diya

        res.json({ status: true, message: "Footer Link FAQs fetched successfully", data: faqs });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getFooterLinkFaqById = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await FooterLinkFaq.findById(id)
            .populate("FooterLink", "title slug")
            .sort({ createdAt: -1 });

        if (!faq) return res.status(404).json({ status: false, message: "Not found" });

        res.json({ status: true, message: "Footer Link FAQ fetched successfully", data: faq });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// Delete
const deleteFooterLinkFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await FooterLinkFaq.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ status: false, message: "Not found" });

        res.json({ status: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Delete FAQ by Index
const deleteFAQSbyIndex = async (req, res) => {
    try {
        const { id, index } = req.params;

        const faqEntry = await FooterLinkFaq.findById(id);
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


module.exports = { addFooterLinkFaq, editFooterLinkFaq, getFooterLinkFaqs, getFooterLinkFaqById, deleteFooterLinkFaq, deleteFAQSbyIndex };