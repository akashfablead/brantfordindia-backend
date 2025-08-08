const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../middleware/authMiddleware");
const { addBlogCategory, editBlogCategory, getBlogCategories, getBlogCategoryById, deleteBlogCategory, getBlogCategoriesWithoutToken } = require("../../controllers/mastercontrollers/blogCategoryController");
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");

router.post("/", upload.none(), authenticateToken, addBlogCategory);
router.put("/:id", upload.none(), authenticateToken, editBlogCategory);
router.get("/", upload.none(), authenticateToken, getBlogCategories);
router.get("/", getBlogCategoriesWithoutToken);
router.get("/:id", upload.none(), authenticateToken, getBlogCategoryById);
router.delete("/:id", upload.none(), authenticateToken, deleteBlogCategory);

module.exports = router;
