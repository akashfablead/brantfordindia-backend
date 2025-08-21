const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../middleware/authMiddleware");
const { addPropertyEnquiry, getPropertyEnquiryById, deletePropertyEnquiry, getPropertyEnquiries } = require("../../controllers/Enquirycontrollers/propertyEnquiryListController");
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");

router.post("/:id", authenticateToken, upload.none(), addPropertyEnquiry);
router.get("/", authenticateToken, getPropertyEnquiries);
router.get("/:id", getPropertyEnquiryById);
router.delete("/:id", authenticateToken, deletePropertyEnquiry);

module.exports = router;
