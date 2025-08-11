const express = require("express");
const { addBlog, editBlog, getAllBlogs, getBlogById, deleteBlog } = require("../controllers/blogController");
const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const upload = createMulterUpload("blogs");
const router = express.Router();

router.post("/", upload.single("image"), authenticateToken, addBlog);
router.put("/:id", upload.single("image"), authenticateToken, editBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.delete("/:id", authenticateToken, deleteBlog);

module.exports = router;
