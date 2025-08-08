const express = require("express");
const { addRole, deleteRole, editRole, getRoleById, getRoles, getRolesWithoutToken } = require("../../controllers/mastercontrollers/roleController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");
const router = express.Router();

router.post("/", authenticateToken, upload.none(), addRole);
router.put("/:id", authenticateToken, upload.none(), editRole);
router.get("/", authenticateToken, upload.none(), getRoles);
router.get("/", getRolesWithoutToken);
router.get("/:id", authenticateToken, upload.none(), getRoleById);
router.delete("/:id", authenticateToken, upload.none(), deleteRole);

module.exports = router;
