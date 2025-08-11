const express = require("express");
const { addJobPost, editJobPost, getJobPosts, deleteJobPost, getJobPostById } = require("../controllers/JobPostController");
const { authenticateToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticateToken, addJobPost);
router.put("/:id", authenticateToken, editJobPost);
router.get("/", getJobPosts);
router.get("/:id", getJobPostById);
router.delete("/:id", authenticateToken, deleteJobPost);

module.exports = router;
