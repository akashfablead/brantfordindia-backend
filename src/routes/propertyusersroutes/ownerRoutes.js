const express = require("express");
const { getAllOwners, getOwnerById } = require("../../controllers/PropertyUserscontrollers/ownerController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");
const router = express.Router();

router.get("/", authenticateToken, upload.none(), getAllOwners);
router.get("/:id", authenticateToken, upload.none(), getOwnerById);

module.exports = router;
