const express = require("express");
const { addBlog, editBlog, getAllBlogs, getBlogById, deleteBlog, getBlogBySlug, getLatestPosts, getRelatedArticles } = require("../controllers/blogController");
const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const optionalAuth = require("../middleware/optionalAuth");
const upload = createMulterUpload("blogs");
const router = express.Router();

router.post("/", upload.single("image"), authenticateToken, addBlog);
router.put("/:id", upload.single("image"), authenticateToken, editBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.get("/slug/:slug", getBlogBySlug);
router.get("/blogs/latest", upload.single(""), optionalAuth, getLatestPosts);
router.get("/blogs/related/:id", upload.single(""), optionalAuth, getRelatedArticles);
router.delete("/:id", authenticateToken, deleteBlog);

module.exports = router;
