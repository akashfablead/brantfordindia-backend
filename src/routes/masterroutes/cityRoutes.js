const express = require("express");
const {
    addCity,
    editCity,
    getCities,
    getCityById,
    deleteCity,
    getCitieswithouttoken
} = require("../../controllers/mastercontrollers/cityController");

const createMulterUpload = require("../../config/multer");
const { authenticateToken } = require("../../middleware/authMiddleware");
const upload = createMulterUpload("cities"); // store in uploads/cities/

const router = express.Router();

router.post("/", authenticateToken, upload.single("image"), addCity);
router.get("/", upload.none(), authenticateToken, getCities);
router.get("/all", upload.none(), getCitieswithouttoken);
router.get("/:id", upload.none(), authenticateToken, getCityById);
router.put("/:id", authenticateToken, upload.single("image"), editCity);
router.delete("/:id", upload.none(), authenticateToken, deleteCity);

module.exports = router;
