const express = require("express");
const { addOrEditGeneralSettings, getGeneralSettings, getGeneralSettingsByType, deleteGeneralSettings } = require("../controllers/generalSettingsController");
const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const upload = createMulterUpload("generalSettings");
const router = express.Router();

// For image uploads
router.post("/", authenticateToken, upload.fields([
    { name: "homePageBanner", maxCount: 1 },
    { name: "aboutUsImage", maxCount: 1 }
]), addOrEditGeneralSettings);
router.get("/", getGeneralSettings);
router.get("/:type", getGeneralSettingsByType);
router.delete("/:id", authenticateToken, deleteGeneralSettings);

module.exports = router;
