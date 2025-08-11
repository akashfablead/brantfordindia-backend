// src/routes/termsRoutes.js
const express = require("express");
const { addOrUpdateTerms, getTerms } = require("../../controllers/mastercontrollers/termsController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");
const router = express.Router();

router.post("/", authenticateToken, upload.none(), addOrUpdateTerms);
router.get("/", getTerms);

module.exports = router;
