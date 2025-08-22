const slugify = require("slugify");
const Blog = require("../models/Blog");

// Add Blog
const addBlog = async (req, res) => {
    try {
        const {
            category, tag, title, imageTag,
            shortDescription, longDescription,
            pageTitle, slug, status, rssFeed
        } = req.body;

        if (!category || !tag || !title || !shortDescription || !longDescription) {
            return res.status(400).json({ status: false, message: "Required fields are missing" });
        }

        // Check if blog with same title already exists (case-insensitive)
        const existingBlog = await Blog.findOne({ title: { $regex: new RegExp(`^${title}$`, "i") } });
        if (existingBlog) {
            return res.status(400).json({ status: false, message: "A blog with this title already exists" });
        }

        if (!req.file) {
            return res.status(400).json({ status: false, message: "Image is required" });
        }

        const blogSlug = slug ? slugify(slug, { lower: true }) : slugify(title, { lower: true });

        const imagePath = `/uploads/blogs/${req.file.filename}`;

        const blog = await Blog.create({
            category,
            tag,
            title: title.trim(),
            image: imagePath,
            imageTag,
            shortDescription,
            longDescription,
            pageTitle,
            slug: blogSlug,
            status: status || "active",
            rssFeed,
            createdBy: req.user.id
        });

        res.json({ status: true, message: "Blog added successfully", blog });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Edit Blog
const editBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        // Check if title is being changed and it's already taken by another blog
        if (updates.title) {
            const existingBlog = await Blog.findOne({
                title: { $regex: new RegExp(`^${updates.title}$`, "i") },
                _id: { $ne: id } // exclude current blog
            });
            if (existingBlog) {
                return res.status(400).json({ status: false, message: "A blog with this title already exists" });
            }
        }

        if (updates.slug) {
            updates.slug = slugify(updates.slug, { lower: true });
        }

        if (req.file) {
            updates.image = `/uploads/blogs/${req.file.filename}`;
        }

        const blog = await Blog.findByIdAndUpdate(id, updates, { new: true });
        if (!blog) {
            return res.status(404).json({ status: false, message: "Blog not found" });
        }

        res.json({ status: true, message: "Blog updated successfully", blog });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get All Blogs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("category", "name")
            .populate("tag", "name")
            .populate("createdBy", "name email role profileImage")
            .sort({ createdAt: -1 });

        const blogsWithFullImage = blogs.map(blog => {
            const fullImage = blog.image ? `${process.env.BACKEND_URL}${blog.image}` : null;
            const fullProfileImage = blog.createdBy?.profileImage
                ? `${process.env.BACKEND_URL}${blog.createdBy.profileImage}`
                : null;

            return {
                ...blog._doc,
                image: fullImage,
                createdBy: blog.createdBy
                    ? { ...blog.createdBy._doc, profileImage: fullProfileImage }
                    : null
            };
        });

        res.json({ status: true, message: "Blogs fetched successfully", blogs: blogsWithFullImage });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get Blog by ID
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("category", "name")
            .populate("tag", "name")
            .populate("createdBy", "name email role profileImage");

        if (!blog) {
            return res.status(404).json({ status: false, message: "Blog not found" });
        }

        const fullImage = blog.image ? `${process.env.BACKEND_URL}${blog.image}` : null;
        const fullProfileImage = blog.createdBy?.profileImage
            ? `${process.env.BACKEND_URL}${blog.createdBy.profileImage}`
            : null;

        const blogWithFullImage = {
            ...blog._doc,
            image: fullImage,
            createdBy: blog.createdBy
                ? { ...blog.createdBy._doc, profileImage: fullProfileImage }
                : null
        };

        res.json({ status: true, message: "Blog fetched successfully", blog: blogWithFullImage });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get Blog by Slug
const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({ status: false, message: "Slug is required" });
        }

        const blog = await Blog.findOne({ slug })
            .populate("category", "name")
            .populate("tag", "name")
            .populate("createdBy", "name email role profileImage");

        if (!blog) {
            return res.status(404).json({ status: false, message: "Blog not found" });
        }

        const fullImage = blog.image ? `${process.env.BACKEND_URL}${blog.image}` : null;
        const fullProfileImage = blog.createdBy?.profileImage
            ? `${process.env.BACKEND_URL}${blog.createdBy.profileImage}`
            : null;

        const blogWithFullImage = {
            ...blog._doc,
            image: fullImage,
            createdBy: blog.createdBy
                ? { ...blog.createdBy._doc, profileImage: fullProfileImage }
                : null
        };

        res.json({ status: true, message: "Blog fetched successfully", blog: blogWithFullImage });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Delete Blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ status: false, message: "Blog not found" });
        }

        await blog.deleteOne();
        res.json({ status: true, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get Latest Posts (limited fields)
const getLatestPosts = async (req, res) => {
    try {
        const { id } = req.query; // id ko query se lo (ya params se)
        const limit = parseInt(req.query.limit) || 5;

        // Filter banate hain
        const filter = {};
        if (id) {
            filter._id = { $ne: id }; // is id ko exclude karna hai
        }

        const latestPosts = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("category", "name")
            .populate("tag", "name")
            .populate("createdBy", "name");

        const simplifiedPosts = latestPosts.map(post => ({
            title: post.title,
            slug: post.slug,
            shortDescription: post.shortDescription,
            image: post.image ? `${process.env.BACKEND_URL}${post.image}` : null,
            category: post.category ? post.category.name : null,
            tag: post.tag ? post.tag.name : null,
            createdBy: post.createdBy ? post.createdBy.name : null,
            createdAt: post.createdAt,
        }));

        res.json({
            status: true,
            message: "Latest posts fetched successfully",
            posts: simplifiedPosts,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get Related Articles
const getRelatedArticles = async (req, res) => {
    try {
        const { id } = req.params; // Target blog post ID
        const limit = parseInt(req.query.limit) || 5; // Default to 5 related articles
        const targetBlog = await Blog.findById(id).populate("tag", "name");

        if (!targetBlog) {
            return res.status(404).json({ status: false, message: "Target blog post not found" });
        }

        const relatedBlogs = await Blog.find({ tag: targetBlog.tag })
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .limit(limit) // Limit the number of related articles
            .populate("category", "name") // Populate category name
            .populate("tag", "name") // Populate tag name
            .populate("createdBy", "name"); // Populate only the name of the creator

        // Map the results to include only necessary fields
        const simplifiedRelatedBlogs = relatedBlogs.map(post => ({
            _id: post._id,
            title: post.title,
            slug: post.slug,
            shortDescription: post.shortDescription,
            image: post.image ? `${process.env.BACKEND_URL}${post.image}` : null,
            category: post.category ? post.category.name : null,
            tag: post.tag ? post.tag.name : null,
            createdBy: post.createdBy ? post.createdBy.name : null,
            createdAt: post.createdAt,
        }))

        res.json({
            status: true,
            message: "Related articles fetched successfully",
            relatedArticles: simplifiedRelatedBlogs,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


module.exports = {
    addBlog,
    editBlog,
    getAllBlogs,
    getBlogById,
    getBlogBySlug,
    deleteBlog,
    getLatestPosts,
    getRelatedArticles
};
