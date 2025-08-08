const JobCategory = require("../../models/Master/JobCategory");

// Add Job Category
const addJobCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Duplicate check
        const existing = await JobCategory.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
        if (existing) {
            return res.status(400).json({ message: "Job Category with this name already exists", success: false });
        }

        const jobCategory = await JobCategory.create({ name, status });
        res.status(201).json({ message: "Job Category added successfully", success: true, jobCategory });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Edit Job Category
const editJobCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const jobCategory = await JobCategory.findById(id);
        if (!jobCategory) return res.status(404).json({ message: "Job Category not found", success: false });

        // Duplicate check excluding current record
        const existing = await JobCategory.findOne({
            name: { $regex: `^${name}$`, $options: "i" },
            _id: { $ne: id }
        });
        if (existing) {
            return res.status(400).json({ message: "Job Category with this name already exists", success: false });
        }

        jobCategory.name = name;
        jobCategory.status = status;
        await jobCategory.save();

        res.status(200).json({ message: "Job Category updated successfully", success: true, jobCategory });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get All Job Categories
const getJobCategories = async (req, res) => {
    try {
        const jobCategories = await JobCategory.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Job Categories fetched successfully", success: true, jobCategories });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get All Job Categories without token
const getJobCategoriesWithoutToken = async (req, res) => {
    try {
        const jobCategories = await JobCategory.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Job Categories fetched successfully", success: true, jobCategories });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get Job Category by ID
const getJobCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const jobCategory = await JobCategory.findById(id);
        if (!jobCategory) return res.status(404).json({ message: "Job Category not found", success: false });

        res.status(200).json({ message: "Job Category fetched successfully", success: true, jobCategory });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Delete Job Category
const deleteJobCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const jobCategory = await JobCategory.findByIdAndDelete(id);
        if (!jobCategory) return res.status(404).json({ message: "Job Category not found", success: false });

        res.status(200).json({ message: "Job Category deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = {
    addJobCategory,
    editJobCategory,
    getJobCategories,
    getJobCategoriesWithoutToken,
    getJobCategoryById,
    deleteJobCategory
};
