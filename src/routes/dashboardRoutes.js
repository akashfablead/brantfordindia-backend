const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const { dashboarduser } = require("../controllers/dashboardController");
const upload = createMulterUpload("");

// Routes
router.get("/", authenticateToken, upload.none(), dashboarduser);


module.exports = router;
