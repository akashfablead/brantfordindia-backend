const express = require("express");
const {
    addFooterLinkMicroMarketFaq,
    editFooterLinkMicroMarketFaq,
    getFooterLinkMicroMarketFaqs,
    getFooterLinkMicroMarketFaqById,
    deleteFooterLinkMicroMarketFaq,
    deleteMicroMarketFAQSbyIndex
} = require("../controllers/footerLinkMicroMarketFaqController");
const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const upload = createMulterUpload("");

const router = express.Router();

router.post("/", authenticateToken, upload.none(), addFooterLinkMicroMarketFaq);
router.put("/:id", authenticateToken, upload.none(), editFooterLinkMicroMarketFaq);
router.get("/", getFooterLinkMicroMarketFaqs);
router.get("/:id", getFooterLinkMicroMarketFaqById);
router.delete("/:id", authenticateToken, deleteFooterLinkMicroMarketFaq);
router.delete("/faq/:id/:index", authenticateToken, deleteMicroMarketFAQSbyIndex);

module.exports = router;
