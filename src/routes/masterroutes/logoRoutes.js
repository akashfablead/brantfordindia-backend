const express = require("express");
const { addOrUpdateLogo, getLogo } = require("../../controllers/mastercontrollers/logoController");
const createMulterUpload = require("../../config/multer");

const router = express.Router();
const upload = createMulterUpload("logo");

// Add/Update Logo
router.post("/", upload.single("image"), addOrUpdateLogo);

// Get Logo
router.get("/", getLogo);

module.exports = router;
