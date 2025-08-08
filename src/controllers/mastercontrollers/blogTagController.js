const BlogTag = require("../../models/Master/BlogTag");


// Add Blog Tag
const addBlogTag = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Duplicate check (case-insensitive)
        const existing = await BlogTag.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
        if (existing) {
            return res.status(400).json({ message: "Blog Tag with this name already exists", success: false });
        }

        const blogTag = await BlogTag.create({ name, status });
        res.status(201).json({ message: "Blog Tag added successfully", success: true, blogTag });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Edit Blog Tag
const editBlogTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const blogTag = await BlogTag.findById(id);
        if (!blogTag) return res.status(404).json({ message: "Blog Tag not found", success: false });

        // Duplicate check excluding current
        const existing = await BlogTag.findOne({
            name: { $regex: `^${name}$`, $options: "i" },
            _id: { $ne: id }
        });
        if (existing) {
            return res.status(400).json({ message: "Blog Tag with this name already exists", success: false });
        }

        blogTag.name = name;
        blogTag.status = status;
        await blogTag.save();

        res.status(200).json({ message: "Blog Tag updated successfully", success: true, blogTag });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get All Blog Tags
const getBlogTags = async (req, res) => {
    try {
        const blogTags = await BlogTag.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Blog Tags fetched successfully", success: true, blogTags });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get All Blog Tags without token
const getBlogTagsWithoutToken = async (req, res) => {
    try {
        const blogTags = await BlogTag.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Blog Tags fetched successfully", success: true, blogTags });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get Blog Tag by ID
const getBlogTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const blogTag = await BlogTag.findById(id);
        if (!blogTag) return res.status(404).json({ message: "Blog Tag not found", success: false });

        res.status(200).json({ message: "Blog Tag fetched successfully", success: true, blogTag });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Delete Blog Tag
const deleteBlogTag = async (req, res) => {
    try {
        const { id } = req.params;
        const blogTag = await BlogTag.findByIdAndDelete(id);
        if (!blogTag) return res.status(404).json({ message: "Blog Tag not found", success: false });

        res.status(200).json({ message: "Blog Tag deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = {
    addBlogTag,
    editBlogTag,
    getBlogTags,
    getBlogTagsWithoutToken,
    getBlogTagById,
    deleteBlogTag
};
