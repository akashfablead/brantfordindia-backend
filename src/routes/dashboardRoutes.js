const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const { dashboarduser, getDashboardStatsadmin } = require("../controllers/dashboardController");
const upload = createMulterUpload("");

// Routes for user dashboard
router.get("/", authenticateToken, upload.none(), dashboarduser);

// Routes for admin dashboard
router.get("/admin", authenticateToken, upload.none(), getDashboardStatsadmin);


module.exports = router;
