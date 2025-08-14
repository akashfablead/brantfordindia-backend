const axios = require("axios");
const PropertyEnquiry = require("../../models/Enquiry/PropertyEnquiryList");
// Google reCAPTCHA Secret Key
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

const addPropertyEnquiry = async (req, res) => {
    try {
        const { subject, firstName, lastName, mobile, address, city, seatsReq, recaptchaToken } = req.body;

        // 🛑 1. Validate required fields
        if (!subject || !firstName || !lastName || !mobile) {
            return res.status(400).json({ status: false, message: "Missing required fields" });
        }

        // 🛑 2. Check if same user submitted within last 24 hours
        const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
        const existingEnquiry = await PropertyEnquiry.findOne({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            subject: subject.trim(),
            mobile: mobile.trim(),
            createdAt: { $gte: timeLimit }
        });

        if (existingEnquiry) {
            return res.status(400).json({
                status: false,
                message: "You can only submit one enquiry every 24 hours."
            });
        }

        // ✅ 3. Verify reCAPTCHA
        if (!recaptchaToken) {
            return res.status(400).json({ status: false, message: "reCAPTCHA token is required" });
        }

        const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}`;
        const captchaRes = await axios.post(verifyURL);

        if (!captchaRes.data.success) {
            return res.status(400).json({ status: false, message: "Failed reCAPTCHA verification" });
        }

        // ✅ 4. Save enquiry
        const enquiry = new PropertyEnquiry({
            subject: subject.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            mobile: mobile.trim(),
            address: address?.trim() || "",
            city: city?.trim() || "",
            seatsReq: seatsReq || null
        });

        await enquiry.save();

        return res.status(201).json({
            status: true,
            message: "Enquiry added successfully",
            data: enquiry
        });

    } catch (error) {
        console.error("Error adding enquiry:", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};


const getPropertyEnquiries = async (req, res) => {
    try {
        const enquiries = await PropertyEnquiry.find().populate("city");
        res.json({ status: true, data: enquiries });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getPropertyEnquiryById = async (req, res) => {
    try {
        const enquiry = await PropertyEnquiry.findById(req.params.id).populate("city");
        if (!enquiry) return res.status(404).json({ status: false, message: "Enquiry not found" });
        res.json({ status: true, data: enquiry });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const deletePropertyEnquiry = async (req, res) => {
    try {
        const enquiry = await PropertyEnquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) return res.status(404).json({ status: false, message: "Enquiry not found" });
        res.json({ status: true, message: "Enquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { addPropertyEnquiry, getPropertyEnquiries, getPropertyEnquiryById, deletePropertyEnquiry };
