const express = require("express");
const { addAdvertise, editAdvertise, getAdvertises, getAdvertiseById, deleteAdvertise } = require("../controllers/advertiseController");
const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const upload = createMulterUpload("advertises");
const router = express.Router();

router.post("/", upload.single("image"), authenticateToken, addAdvertise);
router.put("/:id", upload.single("image"), authenticateToken, editAdvertise);
router.get("/", getAdvertises);
router.get("/:id", getAdvertiseById);
router.delete("/:id", authenticateToken, deleteAdvertise);

module.exports = router;
