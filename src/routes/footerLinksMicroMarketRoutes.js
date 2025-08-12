const express = require("express");
const router = express.Router();
const {
    addFooterLinksMicroMarket,
    editFooterLinksMicroMarket,
    getFooterLinksMicroMarket,
    getFooterLinksMicroMarketById,
    getFooterLinksMicroMarketBySlug,
    deleteFooterLinksMicroMarket
} = require("../controllers/footerLinksMicroMarketController");

const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const upload = createMulterUpload("footerLinksMicroMarket");

const multipleUploads = upload.fields([
    { name: "galleryImages", maxCount: 10 }
]);

router.post("/", authenticateToken, multipleUploads, addFooterLinksMicroMarket);
router.put("/:id", authenticateToken, multipleUploads, editFooterLinksMicroMarket);
router.get("/", getFooterLinksMicroMarket);
router.get("/:id", getFooterLinksMicroMarketById);
router.get("/slug/:slug", getFooterLinksMicroMarketBySlug);
router.delete("/:id", authenticateToken, deleteFooterLinksMicroMarket);

module.exports = router;
