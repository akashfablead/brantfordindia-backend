const express = require("express");

const { authenticateToken } = require("../middleware/authMiddleware");
const { addFAQ, editFAQ, getAllFAQs, getFAQById, deleteFAQ } = require("../controllers/faqController");
const createMulterUpload = require("../config/multer");
const upload = createMulterUpload("");

const router = express.Router();

router.post("/", authenticateToken, upload.none(), addFAQ);
router.put("/:id", authenticateToken, upload.none(), editFAQ);
router.get("/", getAllFAQs);
router.get("/:id", authenticateToken, getFAQById);
router.delete("/:id", authenticateToken, deleteFAQ);

module.exports = router;
