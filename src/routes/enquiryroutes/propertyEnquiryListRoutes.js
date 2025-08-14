const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../middleware/authMiddleware");
const { addPropertyEnquiry, getPropertyEnquiryById, deletePropertyEnquiry, getPropertyEnquiries } = require("../../controllers/Enquirycontrollers/propertyEnquiryListController");
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");

router.post("/", authenticateToken, upload.none(), addPropertyEnquiry);
router.get("/", getPropertyEnquiries);
router.get("/:id", getPropertyEnquiryById);
router.delete("/:id", authenticateToken, deletePropertyEnquiry);

module.exports = router;
