const express = require("express");
const { editUnitType, getUnitTypes, addUnitType, deleteUnitType, getUnitTypeById, getUnitTypesWithoutToken } = require("../../controllers/mastercontrollers/unitTypeController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const router = express.Router();
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");

router.post("/", authenticateToken, upload.none(), addUnitType);
router.put("/:id", authenticateToken, upload.none(), editUnitType);
router.get("/", authenticateToken, upload.none(), getUnitTypes);
router.get("/all", upload.none(), getUnitTypesWithoutToken);
router.get("/:id", authenticateToken, upload.none(), getUnitTypeById);
router.delete("/:id", authenticateToken, upload.none(), deleteUnitType);

module.exports = router;
