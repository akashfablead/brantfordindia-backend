const BlogCategory = require("../../models/Master/BlogCategory");


// Add Blog Category
const addBlogCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Duplicate check (case-insensitive)
        const existing = await BlogCategory.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
        if (existing) {
            return res.status(400).json({ message: "Blog Category with this name already exists", status: false });
        }

        const blogCategory = await BlogCategory.create({ name, status });
        res.status(201).json({ message: "Blog Category added successfully", status: true, blogCategory });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};

// Edit Blog Category
const editBlogCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const blogCategory = await BlogCategory.findById(id);
        if (!blogCategory) return res.status(404).json({ message: "Blog Category not found", status: false });

        // Duplicate check excluding current ID
        const existing = await BlogCategory.findOne({
            name: { $regex: `^${name}$`, $options: "i" },
            _id: { $ne: id }
        });
        if (existing) {
            return res.status(400).json({ message: "Blog Category with this name already exists", status: false });
        }

        blogCategory.name = name;
        blogCategory.status = status;
        await blogCategory.save();

        res.status(200).json({ message: "Blog Category updated successfully", status: true, blogCategory });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};

// Get All Blog Categories
const getBlogCategories = async (req, res) => {
    try {
        const blogCategories = await BlogCategory.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Blog Categories fetched successfully", status: true, blogCategories });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};

// Get All Blog Categories without token
const getBlogCategoriesWithoutToken = async (req, res) => {
    try {
        const blogCategories = await BlogCategory.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Blog Categories fetched successfully", status: true, blogCategories });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};

// Get Blog Category by ID
const getBlogCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const blogCategory = await BlogCategory.findById(id);
        if (!blogCategory) return res.status(404).json({ message: "Blog Category not found", status: false });

        res.status(200).json({ message: "Blog Category fetched successfully", status: true, blogCategory });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};

// Delete Blog Category
const deleteBlogCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const blogCategory = await BlogCategory.findByIdAndDelete(id);
        if (!blogCategory) return res.status(404).json({ message: "Blog Category not found", status: false });

        res.status(200).json({ message: "Blog Category deleted successfully", status: true });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};

module.exports = {
    addBlogCategory,
    editBlogCategory,
    getBlogCategories,
    getBlogCategoriesWithoutToken,
    getBlogCategoryById,
    deleteBlogCategory
};
