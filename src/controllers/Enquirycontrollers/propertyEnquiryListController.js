const axios = require("axios");
const PropertyEnquiry = require("../../models/Enquiry/PropertyEnquiryList");
// Google reCAPTCHA Secret Key
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

const addPropertyEnquiry = async (req, res) => {
    try {
        const { subject, firstName, lastName, mobile, address, city, seatsReq, recaptchaToken } = req.body;
        const { id: propertyId } = req.params;
        const userId = req.user.id; // ✅ logged-in user
        console.log(userId);

        if (!userId) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }

        if (!propertyId) {
            return res.status(400).json({ status: false, message: "Property ID is required in URL" });
        }

        if (!subject || !firstName || !lastName || !mobile || !address || !city || !seatsReq) {
            return res.status(400).json({ status: false, message: "Missing required fields" });
        }

        // Prevent duplicate within 24 hrs
        const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const existingEnquiry = await PropertyEnquiry.findOne({
            property: propertyId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            mobile: mobile.trim(),
            createdAt: { $gte: timeLimit }
        });

        if (existingEnquiry) {
            return res.status(400).json({
                status: false,
                message: "You can only submit one enquiry for this property every 24 hours."
            });
        }

        // ✅ Verify reCAPTCHA
        if (!recaptchaToken) {
            return res.status(400).json({ status: false, message: "reCAPTCHA token is required" });
        }

        const captchaRes = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: RECAPTCHA_SECRET,
                    response: recaptchaToken
                }
            }
        );

        if (!captchaRes.data.success) {
            return res.status(400).json({ status: false, message: "Failed reCAPTCHA verification" });
        }

        // ✅ Save enquiry with user
        const enquiry = new PropertyEnquiry({
            property: propertyId,
            subject: subject.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            mobile: mobile.trim(),
            address: address.trim(),
            city,
            seatsReq,
            user: userId || null
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
        const userId = req.user.id;

        const enquiries = await PropertyEnquiry.find({ user: userId })
            .populate("property")
            .populate("city")
            .populate("user")
            .sort({ createdAt: -1 });

        res.json({ status: true, message: "Enquiries fetched successfully", data: enquiries });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};



const getPropertyEnquiryById = async (req, res) => {
    try {
        const enquiry = await PropertyEnquiry.findById(req.params.id)
            .populate("city")
            .populate("property");

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
