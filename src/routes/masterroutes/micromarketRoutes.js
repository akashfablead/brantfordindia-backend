const express = require("express");
const router = express.Router();
const { addMicromarket, editMicromarket, getMicromarkets, getMicromarketById, deleteMicromarket, getMicromarketswithouttoken } = require("../../controllers/mastercontrollers/micromarketController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");

router.post("/", authenticateToken, upload.none(), addMicromarket);
router.put("/:id", authenticateToken, upload.none(), editMicromarket);
router.get("/", authenticateToken, upload.none(), getMicromarkets);
router.get("/all", upload.none(), getMicromarketswithouttoken);
router.get("/:id", authenticateToken, upload.none(), getMicromarketById);
router.delete("/:id", authenticateToken, upload.none(), deleteMicromarket);

module.exports = router;
