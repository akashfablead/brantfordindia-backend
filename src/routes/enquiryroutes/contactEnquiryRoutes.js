const express = require("express");
const router = express.Router();
const {
    addContactEnquiry,
    getContactEnquiries,
    getContactEnquiryById,
    deleteContactEnquiry
} = require("../../controllers/Enquirycontrollers/contactEnquiryController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");

router.post("/", authenticateToken, upload.none(), addContactEnquiry);
router.get("/", getContactEnquiries);
router.get("/:id", getContactEnquiryById);
router.delete("/:id", deleteContactEnquiry);

module.exports = router;
