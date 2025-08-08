const express = require("express");
const { addBlogTag, editBlogTag, getBlogTags, getBlogTagById, deleteBlogTag, getBlogTagsWithoutToken } = require("../../controllers/mastercontrollers/blogTagController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const router = express.Router();
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");

router.post("/", upload.none(), authenticateToken, addBlogTag);
router.put("/:id", upload.none(), authenticateToken, editBlogTag);
router.get("/", upload.none(), authenticateToken, getBlogTags);
router.get("/all", getBlogTagsWithoutToken);
router.get("/:id", upload.none(), authenticateToken, getBlogTagById);
router.delete("/:id", upload.none(), authenticateToken, deleteBlogTag);

module.exports = router;
