const PostRequirement = require("../../models/Enquiry/PostRequirement");


// ✅ Add new PostRequirement
const addPostRequirement = async (req, res) => {
    try {
        const requirement = new PostRequirement(req.body);
        await requirement.save();

        // Populate before sending response
        const populatedRequirement = await PostRequirement.findById(requirement._id)
            .populate("city")
            .populate("propertyType");

        res.status(201).json({
            status: true,
            message: "Post Requirement added successfully",
            data: populatedRequirement
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// ✅ Get all Post Requirements
const getAllPostRequirements = async (req, res) => {
    try {
        const postRequirements = await PostRequirement.find()
            .populate("city") // fetch full city details
            .populate("propertyType"); // fetch full property type details

        res.json({ status: true, data: postRequirements });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// ✅ Get Post Requirement by ID
const getPostRequirementById = async (req, res) => {
    try {
        const postRequirement = await PostRequirement.findById(req.params.id)
            .populate("city")
            .populate("propertyType");

        if (!postRequirement) {
            return res.status(404).json({ status: false, message: "Not found" });
        }

        res.json({ status: true, data: postRequirement });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};


// Delete PostRequirement
const deletePostRequirement = async (req, res) => {
    try {
        const deleted = await PostRequirement.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ status: false, message: "Not found or already deleted" });
        res.json({ status: true, message: "Requirement deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { addPostRequirement, getAllPostRequirements, getPostRequirementById, deletePostRequirement };