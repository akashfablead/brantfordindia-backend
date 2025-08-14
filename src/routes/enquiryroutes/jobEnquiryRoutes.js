// routes/jobEnquiryRoutes.js
const express = require("express");
const router = express.Router();
const createMulterUpload = require("../../config/multer");
const { addJobEnquiry, getAllJobEnquiries, getJobEnquiryById, deleteJobEnquiry } = require("../../controllers/Enquirycontrollers/jobEnquiryController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const upload = createMulterUpload("resumes");


router.post("/", upload.single("cv"), authenticateToken, addJobEnquiry);
router.get("/", getAllJobEnquiries);
router.get("/:id", getJobEnquiryById);
router.delete("/:id", authenticateToken, deleteJobEnquiry);

module.exports = router;
