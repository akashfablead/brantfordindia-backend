const express = require("express");
const { addFooterLinkFaq, editFooterLinkFaq, getFooterLinkFaqs, getFooterLinkFaqById, deleteFooterLinkFaq, deleteFAQSbyIndex } = require("../controllers/footerLinkFaqController");
const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const upload = createMulterUpload("");

const router = express.Router();

router.post("/", authenticateToken, upload.none(), addFooterLinkFaq);
router.put("/:id", authenticateToken, upload.none(), editFooterLinkFaq);
router.get("/", getFooterLinkFaqs);
router.get("/:id", getFooterLinkFaqById);
router.delete("/:id", authenticateToken, deleteFooterLinkFaq);
router.delete("/faq/:id/:index", authenticateToken, deleteFAQSbyIndex);

module.exports = router;
