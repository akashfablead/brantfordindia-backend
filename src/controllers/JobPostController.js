const JobPost = require("../models/JobPost");

// Add Job Post
// Add Job Post
const addJobPost = async (req, res) => {
    try {
        const { jobCategory, city, name, description, type, status } = req.body;

        // Duplicate name check (case-insensitive)
        const existingPost = await JobPost.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
        if (existingPost) {
            return res.status(400).json({ success: false, message: "Job post with this name already exists" });
        }

        const jobPost = await JobPost.create({
            jobCategory,
            city,
            name,
            description,
            type,
            status
        });

        res.status(201).json({ success: true, message: "Job post added successfully", jobPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Edit Job Post
const editJobPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Duplicate name check (ignore same ID)
        if (name) {
            const existingPost = await JobPost.findOne({
                _id: { $ne: id },
                name: { $regex: `^${name}$`, $options: "i" }
            });
            if (existingPost) {
                return res.status(400).json({ success: false, message: "Job post with this name already exists" });
            }
        }

        const jobPost = await JobPost.findByIdAndUpdate(id, req.body, { new: true });
        if (!jobPost) return res.status(404).json({ success: false, message: "Job post not found" });

        res.status(200).json({ success: true, message: "Job post updated successfully", jobPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Job Posts
const getJobPosts = async (req, res) => {
    try {
        const jobPosts = await JobPost.find()
            .populate("jobCategory", "name")
            .populate("city", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, message: "Job posts fetched successfully", jobPosts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Job Post by ID
const getJobPostById = async (req, res) => {
    try {
        const jobPost = await JobPost.findById(req.params.id)
            .populate("jobCategory", "name")
            .populate("city", "name");

        if (!jobPost) return res.status(404).json({ success: false, message: "Job post not found" });

        res.status(200).json({ success: true, message: "Job post fetched successfully", jobPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Job Post
const deleteJobPost = async (req, res) => {
    try {
        const jobPost = await JobPost.findByIdAndDelete(req.params.id);
        if (!jobPost) return res.status(404).json({ success: false, message: "Job post not found" });

        res.status(200).json({ success: true, message: "Job post deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addJobPost,
    editJobPost,
    getJobPosts,
    getJobPostById,
    deleteJobPost
};
