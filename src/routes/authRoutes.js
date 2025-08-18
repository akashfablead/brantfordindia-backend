// src/routes/authRoutes.js
const express = require("express");
const { register, login, getProfile, editProfile, changePassword, sendResetLink, resetPassword, googleLogin, facebookLogin } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const upload = createMulterUpload("profiles");

const router = express.Router();

router.post("/register", upload.none(), register);
router.post("/login", upload.none(), login);
router.post("/google-login", upload.none(), googleLogin);
router.post("/facebook-login", upload.none(), facebookLogin);
router.get("/profile", authenticateToken, getProfile);
router.put("/edit-profile", authenticateToken, upload.single("profileImage"), editProfile);
router.put("/change-password", authenticateToken, upload.none(), changePassword);
router.post("/forgot-password", upload.none(), sendResetLink);
router.post("/reset-password/:token", upload.none(), resetPassword);


module.exports = router;
