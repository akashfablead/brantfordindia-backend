const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../../models/User");
const Payment = require("../../models/Package/payment");
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

// ✅ Verify Payment
// const verifyPayment = async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, packageId } = req.body;

//         const body = razorpay_order_id + "|" + razorpay_payment_id;
//         const expectedSignature = crypto
//             .createHmac("sha256", process.env.RAZORPAY_SECRET)
//             .update(body.toString())
//             .digest("hex");

//         if (expectedSignature !== razorpay_signature) {
//             return res.status(400).json({ success: false, message: "Payment verification failed" });
//         }

//         const pkg = await CreditPackages.findById(packageId);
//         if (!pkg) return res.status(404).json({ error: "Package not found" });

//         const payment = new Payment({
//             userId,
//             packageId,
//             amount: pkg.price,
//             status: "Success",
//             razorpayId: razorpay_payment_id,
//             paymentDate: new Date(),
//         });
//         await payment.save();

//         // Update User Credits
//         const user = await User.findById(userId);
//         if (pkg.category === "whatsapp") {
//             user.credits.whatsapp += pkg.credits;
//         } else if (pkg.category === "sms") {
//             user.credits.sms += pkg.credits;
//         } else if (pkg.category === "ai") {
//             user.credits.ai += pkg.credits;
//         } else if (pkg.category === "costemized") {
//             user.credits.costemized += pkg.credits;
//         }
//         await user.save();

//         res.status(200).json({ success: true, message: "Payment verified and credits updated", payment, user });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

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

        // 🔹 Update User Credits
        const user = await User.findById(userId);
        if (pkg.category === "whatsapp") {
            user.credits.whatsapp += pkg.credits;
        } else if (pkg.category === "sms") {
            user.credits.sms += pkg.credits;
        } else if (pkg.category === "ai") {
            user.credits.ai += pkg.credits;
        } else if (pkg.category === "costemized") {
            user.credits.costemized += pkg.credits;
        }
        await user.save();

        res.status(200).json({
            success: true,
            message: "Payment verified and credits updated",
            payment,
            user,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ✅ Transfer Credits after successful payment (Admin only)
const transferCredits = async (req, res) => {
    try {
        const { PackageId } = req.body;

        // ✅ Find Payment by its _id
        // const payment = await Payment.findById(paymentId)
        //     .populate("userId", "name email")
        //     .populate("packageId", "name category credits price status");

        const payment = await Payment.findOne({ packageId: PackageId })
            .populate("userId", "name email")
            .populate("packageId", "name category credits price status");

        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }

        if (payment.status !== "Success") {
            return res.status(400).json({ error: "Payment is not successful yet" });
        }

        if (payment.creditsTransferred) {
            return res.status(400).json({ error: "Credits already transferred for this payment" });
        }

        const pkg = payment.packageId;
        if (!pkg) {
            return res.status(404).json({ error: "Package not found for this payment" });
        }

        const user = await User.findById(payment.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // ✅ Update User Credits
        if (pkg.category === "whatsapp") {
            user.credits.whatsapp += pkg.credits;
        } else if (pkg.category === "sms") {
            user.credits.sms += pkg.credits;
        } else if (pkg.category === "ai") {
            user.credits.ai += pkg.credits;
        } else if (pkg.category === "costemized") {
            user.credits.costemized += pkg.credits;
        }

        await user.save();

        // ✅ Mark credits transferred
        payment.creditsTransferred = true;
        await payment.save();

        res.status(200).json({
            success: true,
            message: "Credits transferred successfully",
            user,
            payment,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Admin: Get all payments
const getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("userId", "name email")
            .populate("packageId", "name category credits price");
        res.json({ status: true, payments });
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
            .populate("userId", "name email")
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
    getPaymentHistory,
    getUserPayments,
    getPaymentById,
};
