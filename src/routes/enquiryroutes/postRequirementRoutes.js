const express = require("express");
const router = express.Router();
const { addPostRequirement, getAllPostRequirements, getPostRequirementById, deletePostRequirement } = require("../../controllers/Enquirycontrollers/postRequirementController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");

// POST - Add requirement
router.post("/", authenticateToken, upload.none(), addPostRequirement);

// GET - All requirements
router.get("/", getAllPostRequirements);

// GET - Single requirement
router.get("/:id", getPostRequirementById);

// DELETE - Requirement
router.delete("/:id", authenticateToken, deletePostRequirement);

module.exports = router;
