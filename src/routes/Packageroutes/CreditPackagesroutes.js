const express = require("express");
const { createPackage, deletePackage, getActivePackages, getPackageById, getPackages, togglePackageStatus, updatePackage } = require("../../controllers/Packagecontrollers/CreditPackagescntroller");
const { authenticateToken } = require("../../middleware/authMiddleware");
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");

const router = express.Router();

router.post("/", authenticateToken, upload.none(), createPackage);
router.get("/", getPackages);
router.get("/active", getActivePackages);
router.get("/:id", getPackageById);
router.put("/:id", authenticateToken, upload.none(), updatePackage);
router.delete("/:id", deletePackage);
router.patch("/toggle/:id", authenticateToken, upload.none(), togglePackageStatus);

module.exports = router;
