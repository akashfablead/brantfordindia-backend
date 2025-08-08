// routes/amenityRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const createMulterUpload = require("../../config/multer");
const { addAmenity, editAmenity, deleteAmenity, getAmenities, getAmenityById, getAmenitieswithouttoken } = require("../../controllers/mastercontrollers/AmenityController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const upload = createMulterUpload("amenities");

router.post("/", authenticateToken, upload.single("image"), addAmenity);
router.put("/:id", authenticateToken, upload.single("image"), editAmenity);
router.delete("/:id", upload.none(), authenticateToken, deleteAmenity);
router.get("/", upload.none(), authenticateToken, getAmenities);
router.get("/all", upload.none(), getAmenitieswithouttoken);
router.get("/:id", upload.none(), authenticateToken, getAmenityById);

module.exports = router;
