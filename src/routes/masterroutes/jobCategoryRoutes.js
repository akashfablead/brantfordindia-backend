const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../../middleware/authMiddleware");
const createMulterUpload = require("../../config/multer");
const { addJobCategory, editJobCategory, getJobCategories, getJobCategoryById, deleteJobCategory, getJobCategoriesWithoutToken } = require("../../controllers/mastercontrollers/jobCategoryController");
const upload = createMulterUpload("");

router.post("/", authenticateToken, upload.none(), addJobCategory);
router.put("/:id", authenticateToken, upload.none(), editJobCategory);
router.get("/", authenticateToken, upload.none(), getJobCategories);
router.get("/all", getJobCategoriesWithoutToken);
router.get("/:id", authenticateToken, upload.none(), getJobCategoryById);
router.delete("/:id", authenticateToken, upload.none(), deleteJobCategory);

module.exports = router;
