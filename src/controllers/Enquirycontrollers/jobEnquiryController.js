// controllers/jobEnquiryController.js
const JobEnquiry = require("../../models/Enquiry/jobEnquiry");

// Helper to build full file URL
const getFullUrl = (req, filePath) => {
    if (!filePath) return "";
    return `${req.protocol}://${req.get("host")}/${filePath.replace(/\\/g, "/")}`;
};

// Add Job Enquiry
const addJobEnquiry = async (req, res) => {
    try {
        const { jobId, name, email, mobileNumber, coverLetter } = req.body;

        if (!req.file) {
            return res.status(400).json({ status: false, message: "CV file is required" });
        }

        const enquiry = new JobEnquiry({
            jobId,
            name,
            email,
            mobileNumber,
            coverLetter,
            cv: req.file.path
        });

        await enquiry.save();

        res.json({
            status: true,
            message: "Job enquiry submitted",
            data: {
                ...enquiry.toObject(),
                cv: getFullUrl(req, enquiry.cv)
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get all enquiries
const getAllJobEnquiries = async (req, res) => {
    try {
        const enquiries = await JobEnquiry.find()
            .populate({
                path: "jobId",
                populate: [
                    { path: "jobCategory", model: "JobCategory" },
                    { path: "city", model: "City" }
                ]
            });

        res.json({
            status: true,
            data: enquiries.map(enquiry => ({
                ...enquiry.toObject(),
                cv: getFullUrl(req, enquiry.cv)
            }))
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get enquiry by ID
const getJobEnquiryById = async (req, res) => {
    try {
        const enquiry = await JobEnquiry.findById(req.params.id).populate("jobId")
            .populate({
                path: "jobId",
                populate: [
                    { path: "jobCategory", model: "JobCategory" },
                    { path: "city", model: "City" }
                ]
            });
        if (!enquiry) return res.status(404).json({ status: false, message: "Not found" });

        res.json({
            status: true,
            data: {
                ...enquiry.toObject(),
                cv: getFullUrl(req, enquiry.cv)
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Delete enquiry
const deleteJobEnquiry = async (req, res) => {
    try {
        const enquiry = await JobEnquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) return res.status(404).json({ status: false, message: "Not found or already deleted" });

        res.json({ status: true, message: "Job enquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    addJobEnquiry,
    getAllJobEnquiries,
    getJobEnquiryById,
    deleteJobEnquiry
};
