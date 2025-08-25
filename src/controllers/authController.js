// src/controllers/authController.js
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { default: axios } = require("axios");
const Property = require("../models/Property");
const PropertyEnquiryList = require("../models/Enquiry/PropertyEnquiryList");

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.FRONTEND_URL
);

const register = async (req, res) => {
    try {
        const { name, email, number, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const defaultProfileImage = "/uploads/profiles/default-profile-image.png";
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            number,
            password: hashedPassword,
            role,
            profileImage: req.file ? `/uploads/profiles/${req.file.filename}` : defaultProfileImage,
        });

        await user.save();

        // ✅ format full image URL
        const fullImageUrl = user.profileImage
            ? `${process.env.BACKEND_URL.replace(/\/$/, "")}/${user.profileImage.replace(/^\//, "")}`
            : null;

        res.status(201).json({
            status: true,
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
                role: user.role,
                profileImage: fullImageUrl,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if all fields are provided
        if (!email || !password || !role) {
            return res.status(400).json({ status: false, message: "Email, password, and role are required" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Validate role
        if (user.role !== role) {
            return res.status(403).json({ status: false, message: "You are not authorized for this role" });
        }

        // Validate password type
        if (typeof user.password !== "string") {
            return res.status(500).json({ status: false, message: "Stored password is invalid. Please reset your password." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            status: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                number: user.number,
                profileImage: user.profileImage ? `${process.env.BACKEND_URL}${user.profileImage}` : null,
                loginProvider: user.loginProvider || "local", // default to 'local' if not set
                status: user.status,
                isloggedIn: true,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ status: false, message: "Server error during login" });
    }
};



const googleLogin = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ status: false, message: "Authorization code required" });
        }

        // 👇 Auth code exchange with Google
        const { tokens } = await client.getToken(code);

        // Ab tokens me access_token aur id_token dono milenge
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // User check / create
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                name,
                avatar: picture,
                password: crypto.randomBytes(20).toString("hex"),
                role: "user",
                loginProvider: "google",
                isloggedIn: true,
            });
        }

        // JWT generate
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ status: true, token, user });
    } catch (err) {
        console.error("Google login error:", err);
        res.status(500).json({ status: false, message: "Google login failed" });
    }
};

const facebookLogin = async (req, res) => {
    try {
        const { accessToken } = req.body || {};

        if (!accessToken) {
            return res.status(400).json({
                status: false,
                message: "Access token is required"
            });
        }

        // 🔹 Verify Facebook token & get user profile
        const fbResponse = await axios.get(
            `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
        );

        const { name, email, picture, id } = fbResponse.data;

        if (!email) {
            return res.status(400).json({
                status: false,
                message: "Email permission is required from Facebook"
            });
        }

        // 🔹 Check if user exists in DB
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name,
                email,
                profileImage: picture?.data?.url,
                password: null,
                number: null,
                role: "user", // default role
                loginProvider: "facebook",
                isloggedIn: true,

            });
            await user.save();
        }

        // 🔹 Generate JWT
        const authToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        return res.status(200).json({
            status: true,
            message: "Facebook login successful",
            token: authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                number: user.number,
                password: user.password,
                profileImage: user.profileImage,
                loginProvider: user.loginProvider,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error("Facebook Login Error:", error.response?.data || error.message);
        return res.status(500).json({
            status: false,
            message: error.response?.data?.error?.message || error.message
        });
    }
};

// GET /profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        let fullImageUrl = null;

        if (user.profileImage) {
            // Only prepend BACKEND_URL if loginProvider is not google/facebook
            if (user.loginProvider === "google" || user.loginProvider === "facebook") {
                fullImageUrl = user.profileImage; // keep external URL as-is
            } else {
                fullImageUrl = `${process.env.BACKEND_URL}${user.profileImage}`;
            }
        }

        // ✅ Count total listings created by this user
        const totalListings = await Property.countDocuments({ userId: user._id });

        // ✅ Count total enquiries made by this user
        const totalEnquiries = await PropertyEnquiryList.countDocuments({ userId: user._id });

        res.json({
            status: true,
            user: {
                ...user._doc,
                profileImage: fullImageUrl,
                totalListings,
                totalEnquiries,
            },
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};



// PUT /profile
const editProfile = async (req, res) => {
    try {
        const { name, email, number, bio, stateId, cityId } = req.body;
        const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` : undefined;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.email = email || user.email;
        user.number = number || user.number;
        user.bio = bio || user.bio;
        user.stateId = stateId || user.stateId;
        user.cityId = cityId || user.cityId;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        const fullImageUrl = user.profileImage
            ? `${process.env.BACKEND_URL}${user.profileImage}`
            : null;

        res.json({
            status: true,
            message: "Profile updated successfully",
            user: { ...user._doc, profileImage: fullImageUrl },
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// PUT /change-password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Basic validations
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ status: false, message: "New password and confirm password do not match" });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: false, message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Incorrect current password" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ status: true, message: "Password changed successfully" });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// Controller: sendResetLink
const sendResetLink = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
        await user.save();

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // ⛔ For now return the link (replace with email sending)
        return res.json({
            status: true,
            message: "Reset link sent to email",
            resetURL, // ⛔ REMOVE in production
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// Controller: resetPassword
const resetPassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const { token } = req.params; // same as req.params.token

        // 1. Validate input
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ status: false, message: "Passwords do not match" });
        }

        // 2. Hash token (same method as when storing in forgot password)
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // 3. Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ status: false, message: "Token is invalid or expired" });
        }

        // 4. Update password and clear reset fields
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.json({ status: true, message: "Password has been reset successfully" });

    } catch (err) {
        console.error("Reset Password Error:", err);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
};


module.exports = {
    register,
    login,
    googleLogin,
    facebookLogin,
    getProfile,
    editProfile,
    changePassword,
    sendResetLink,
    resetPassword,
};
