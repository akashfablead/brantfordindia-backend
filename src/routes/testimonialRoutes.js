const express = require("express");
const router = express.Router();
const { addTestimonial, editTestimonial, getTestimonials, getTestimonialById, deleteTestimonial } = require("../controllers/testimonialController");
const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const upload = createMulterUpload("testimonials");

// Routes
router.get("/", getTestimonials);
router.get("/:id", getTestimonialById);
router.post("/", authenticateToken, upload.single("image"), addTestimonial);
router.put("/:id", authenticateToken, upload.single("image"), editTestimonial);
router.delete("/:id", authenticateToken, deleteTestimonial);

module.exports = router;
