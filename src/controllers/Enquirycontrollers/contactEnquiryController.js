const axios = require("axios");
const ContactEnquiry = require("../../models/Enquiry/ContactEnquiry");
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET; // Set in .env file

// Add Contact Enquiry
const addContactEnquiry = async (req, res) => {
    try {
        const { subject, firstName, lastName, mobile, email, message, recaptchaToken } = req.body;

        // Step 1: Check if same user made enquiry in last 24 hours
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);

        const existingEnquiry = await ContactEnquiry.findOne({
            firstName,
            lastName,
            subject,
            mobile,
            createdAt: { $gte: yesterday }
        });

        if (existingEnquiry) {
            return res.status(400).json({
                status: false,
                message: "You can only submit one enquiry every 24 hours."
            });
        }

        // // Step 2: Verify reCAPTCHA
        // if (!recaptchaToken) {
        //     return res.status(400).json({ status: false, message: "reCAPTCHA token is required" });
        // }

        // const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}`;
        // const captchaRes = await axios.post(verifyURL);

        // if (!captchaRes.data.success) {
        //     return res.status(400).json({ status: false, message: "Failed reCAPTCHA verification" });
        // }

        // Step 3: Save data
        const enquiry = new ContactEnquiry({
            subject,
            firstName,
            lastName,
            mobile,
            email,
            message
        });

        await enquiry.save();

        res.status(201).json({ status: true, message: "Enquiry added successfully", data: enquiry });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get All Contact Enquiries
const getContactEnquiries = async (req, res) => {
    try {
        const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 });
        res.json({ status: true, data: enquiries });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get Contact Enquiry by ID
const getContactEnquiryById = async (req, res) => {
    try {
        const enquiry = await ContactEnquiry.findById(req.params.id);
        if (!enquiry) return res.status(404).json({ status: false, message: "Enquiry not found" });
        res.json({ status: true, data: enquiry });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Delete Contact Enquiry
const deleteContactEnquiry = async (req, res) => {
    try {
        const enquiry = await ContactEnquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) return res.status(404).json({ status: false, message: "Enquiry not found" });
        res.json({ status: true, message: "Enquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    addContactEnquiry,
    getContactEnquiries,
    getContactEnquiryById,
    deleteContactEnquiry
};
