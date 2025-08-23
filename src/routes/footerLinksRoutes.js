const express = require("express");
const router = express.Router();
const { addFooterLink, editFooterLink, getFooterLinks, getFooterLinkById, getFooterLinkBySlug, deleteFooterLink, getFooterLinksByPropertyType } = require("../controllers/footerLinksController");
const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const upload = createMulterUpload("footerLinks");

const multipleUploads = upload.fields([
    { name: "galleryImages", maxCount: 10 }
]);

// CRUD routes
router.post("/", authenticateToken, multipleUploads, addFooterLink);
router.put("/:id", authenticateToken, multipleUploads, editFooterLink);
router.get("/", getFooterLinks);
router.get("/property-type", getFooterLinksByPropertyType);
router.get("/:id", getFooterLinkById);
router.get("/slug/:slug", getFooterLinkBySlug);
router.delete("/:id", authenticateToken, deleteFooterLink);

module.exports = router;
