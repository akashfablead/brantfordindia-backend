const express = require("express");
const { addPropertyType, editPropertyType, getPropertyTypes, getPropertyTypeById, deletePropertyType, getPropertyTypesWithoutToken } = require("../../controllers/mastercontrollers/propertyTypeController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const router = express.Router();
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");

router.post("/", authenticateToken, upload.none(), addPropertyType);
router.put("/:id", authenticateToken, upload.none(), editPropertyType);
router.get("/", authenticateToken, upload.none(), getPropertyTypes);
router.get("/all", upload.none(), getPropertyTypesWithoutToken);
router.get("/:id", authenticateToken, upload.none(), getPropertyTypeById);
router.delete("/:id", authenticateToken, upload.none(), deletePropertyType);

module.exports = router;
