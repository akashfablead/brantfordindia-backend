const express = require("express");
const {
    addClientSlider,
    editClientSlider,
    getAllClientSliders,
    getClientSliderById,
    deleteClientSlider
} = require("../../controllers/mastercontrollers/clientSliderController");
const createMulterUpload = require("../../config/multer");
const { authenticateToken } = require("../../middleware/authMiddleware");
const upload = createMulterUpload("client-sliders");
const router = express.Router();

router.post("/", upload.single("logo"), authenticateToken, addClientSlider);
router.put("/:id", upload.single("logo"), authenticateToken, editClientSlider);
router.get("/", getAllClientSliders);
router.get("/:id", authenticateToken, getClientSliderById);
router.delete("/:id", authenticateToken, deleteClientSlider);

module.exports = router;
