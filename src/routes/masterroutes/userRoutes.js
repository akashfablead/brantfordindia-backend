const express = require("express");
const { getUsers, getUserById, editUser, deleteUser } = require("../../controllers/mastercontrollers/userController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");

const router = express.Router();

router.get("/", authenticateToken, upload.none(), getUsers);
router.get("/:id", authenticateToken, upload.none(), getUserById);
router.put("/:id", authenticateToken, upload.none(), editUser);
router.delete("/:id", authenticateToken, upload.none(), deleteUser);

module.exports = router;
