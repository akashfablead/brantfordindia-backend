const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../../models/User");
const Payment = require("../../models/Package/payment"); // ✅ sirf ye rakho

const CreditPackages = require("../../models/Package/CreditPackages");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

// ✅ Create Order (only userId + packageId + orderId return)
const createOrder = async (req, res) => {
    try {
        const { packageId, userId } = req.body;

        const pkg = await CreditPackages.findById(packageId);
        if (!pkg || pkg.status !== "active") {
            return res.status(404).json({ error: "Package not available" });
        }

        const options = {
            amount: pkg.price * 100, // paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            notes: { packageId, userId }
        };

        const order = await razorpay.orders.create(options);

        // ✅ Minimal response
        res.status(200).json({
            status: true,
            orderId: order.id,   // Razorpay ka orderId zaroor chahiye payment ke liye
            userId,
            packageId,
            package: {
                name: pkg.name,
                category: pkg.category,
                credits: pkg.credits,
                price: pkg.price
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, packageId } = req.body;

        // 🔹 Signature generate using same formula
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET) // use .env secret
            .update(body.toString())
            .digest("hex");

        console.log("Generated Signature:", expectedSignature);

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        // 🔹 Fetch Package
        const pkg = await CreditPackages.findById(packageId);
        if (!pkg) return res.status(404).json({ error: "Package not found" });

        // 🔹 Save Payment
        const payment = new Payment({
            userId,
            packageId,
            amount: pkg.price,
            status: "Success",
            razorpayId: razorpay_payment_id,
            paymentDate: new Date(),
        });
        await payment.save();

        res.status(200).json({
            success: true,
            message: "Payment verified and credits updated",
            payment,
            note: "Credits pending admin approval"

        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Transfer Credits after successful payment (Admin only)
// ✅ Admin-only: Transfer Credits
const transferCredits = async (req, res) => {
    try {
        const { paymentId } = req.body;

        // 🔹 Check admin
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied. Admin only." });
        }

        // 🔹 Fetch payment with correct populate
        const payment = await Payment.findById(paymentId)
            .populate("userId")
            .populate("packageId"); // ✅ Fixed: use lowercase to match schema

        console.log("Payment found:", payment);

        if (!payment) return res.status(404).json({ error: "Payment not found" });
        if (payment.creditsTransferred) return res.status(400).json({ error: "Credits already transferred" });

        const user = payment.userId;
        const pkg = payment.packageId; // ✅ Now this will work correctly

        console.log("User:", user);
        console.log("Package:", pkg);

        if (!user || !pkg) return res.status(400).json({ error: "Invalid payment data" });

        // 🔹 Add credits based on package category
        switch (pkg.category) {
            case "whatsapp":
                user.credits.whatsapp += pkg.credits;
                break;
            case "sms":
                user.credits.sms += pkg.credits;
                break;
            case "ai":
                user.credits.ai += pkg.credits;
                break;
            case "costemized":
                user.credits.costemized += pkg.credits;
                break;
            default:
                return res.status(400).json({ error: "Invalid package category" });
        }

        await user.save();

        // 🔹 Mark payment as transferred
        payment.creditsTransferred = true;
        await payment.save();

        res.status(200).json({
            success: true,
            message: "Credits successfully transferred",
            payment,
            user
        });

    } catch (err) {
        console.error("Transfer Credits Error:", err);
        res.status(500).json({ error: err.message });
    }
};


// ✅ Get payments by credit transfer status (Admin + filtering)
const getPaymentsByStatus = async (req, res) => {
    try {
        const { status, userId } = req.query;

        // Build filter object
        let filter = {};

        // Filter by credits transfer status
        if (status === 'transferred') {
            filter.creditsTransferred = true;
        } else if (status === 'pending') {
            filter.creditsTransferred = { $ne: true }; // false or null/undefined
        }

        // Optional: Filter by specific user (useful for user-specific queries)
        if (userId) {
            filter.userId = userId;
        }

        // Execute query with populate
        const payments = await Payment.find(filter)
            .populate("userId", "name email")
            .populate("packageId", "name category credits price")
            .sort({ paymentDate: -1 }); // Latest first

        // Separate counts for better response
        const transferredCount = await Payment.countDocuments({
            ...filter,
            creditsTransferred: true
        });
        const pendingCount = await Payment.countDocuments({
            ...filter,
            creditsTransferred: { $ne: true }
        });

        res.json({
            status: true,
            message: "Payments fetched successfully",
            stats: {
                total: payments.length,
                transferred: transferredCount,
                pending: pendingCount
            },
            payments: payments
        });

    } catch (err) {
        console.error("Get Payments By Status Error:", err);
        res.status(500).json({ error: err.message });
    }
};


// ✅ Admin: Get all payments
const getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("userId", "name email")
            .populate("packageId", "name category credits price");
        res.json({
            status: true,
            message: "Payment history fetched successfully",
            count: payments.length,
            payments: payments
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ User: Get user's payments
const getUserPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.params.id })
            .populate("packageId", "name category credits price");
        res.json({ status: true, payments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Single payment details
const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate("userId", "name email credits")
            .populate("packageId", "name category credits price");
        if (!payment) return res.status(404).json({ error: "Payment not found" });
        res.json({ status: true, payment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    transferCredits,
    getPaymentsByStatus,
    getPaymentHistory,
    getUserPayments,
    getPaymentById,
};
