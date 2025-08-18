const express = require("express");
const { authenticateToken } = require("../../middleware/authMiddleware");
const createMulterUpload = require("../../config/multer");
const { getAllBrokers, getBrokerById } = require("../../controllers/PropertyUserscontrollers/brokerController");
const upload = createMulterUpload("");
const router = express.Router();

// 🟢 All Brokers
router.get("/", authenticateToken, upload.none(), getAllBrokers);

// 🟢 Single Broker by ID
router.get("/:id", authenticateToken, upload.none(), getBrokerById);

module.exports = router;
