const express = require("express");
const { addAdminUser, editAdminUser, getAdminUsers, getAdminUserById, deleteAdminUser } = require("../../controllers/mastercontrollers/adminuserController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const router = express.Router();
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");

// Admin User CRUD
router.post("/", authenticateToken, upload.none(), addAdminUser);
router.put("/:id", authenticateToken, upload.none(), editAdminUser);
router.get("/", authenticateToken, upload.none(), getAdminUsers);
router.get("/:id", authenticateToken, upload.none(), getAdminUserById);
router.delete("/:id", authenticateToken, upload.none(), deleteAdminUser);

module.exports = router;
