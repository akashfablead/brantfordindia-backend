const express = require("express");
const { addLocality, editLocality, getLocalities, getLocalityById, deleteLocality, getLocalitieswithouttoken } = require("../../controllers/mastercontrollers/localityController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const createMulterUpload = require("../../config/multer");
const router = express.Router();
const upload = createMulterUpload("");

router.post("/", upload.none(), authenticateToken, addLocality);
router.put("/:id", upload.none(), authenticateToken, editLocality);
router.get("/", upload.none(), authenticateToken, getLocalities);
router.get("/all", upload.none(), getLocalitieswithouttoken);
router.get("/:id", upload.none(), authenticateToken, getLocalityById);
router.delete("/:id", upload.none(), authenticateToken, deleteLocality);

module.exports = router;
