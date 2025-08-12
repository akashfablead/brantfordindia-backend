const express = require("express");
const { addJobPost, editJobPost, getJobPosts, deleteJobPost, getJobPostById } = require("../controllers/JobPostController");
const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const upload = createMulterUpload("");
const router = express.Router();

router.post("/", authenticateToken, upload.none(), addJobPost);
router.put("/:id", authenticateToken, upload.none(), editJobPost);
router.get("/", getJobPosts);
router.get("/:id", getJobPostById);
router.delete("/:id", authenticateToken, deleteJobPost);

module.exports = router;
