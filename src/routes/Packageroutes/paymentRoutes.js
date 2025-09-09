// routes/payment.js
const express = require("express");
const {
    createOrder,
    verifyPayment,
    getPaymentHistory,
    getUserPayments,
    getPaymentById,
    transferCredits,
    getPaymentsByStatus
} = require("../../controllers/Packagecontrollers/paymentController");
const createMulterUpload = require("../../config/multer");
const { authenticateToken } = require("../../middleware/authMiddleware");
const upload = createMulterUpload("");

const router = express.Router();

// Create Razorpay Order
router.post("/create-order", authenticateToken, upload.none(), createOrder);

// Verify Payment after checkout
router.post("/verify", authenticateToken, upload.none(), verifyPayment);

// Admin: Transfer credits
router.post("/transfer-credits", authenticateToken, upload.none(), transferCredits);

//  Admin: Get payments by status
router.get("/get-by-status", authenticateToken, upload.none(), getPaymentsByStatus);

// Admin: Get all payments
router.get("/", authenticateToken, getPaymentHistory);

// User: Get logged-in user's payments
router.get("/user/:id", authenticateToken, getUserPayments);

// Get single payment by id
router.get("/:id", authenticateToken, getPaymentById);

module.exports = router;
