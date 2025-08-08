const User = require("../../models/User");
const bcrypt = require("bcryptjs");

// Add admin user
const addAdminUser = async (req, res) => {
    try {
        const { roleId, name, email, number, password, status } = req.body;

        // Check duplicate email
        const existingEmail = await User.findOne({ email, role: "admin" });
        if (existingEmail) {
            return res.status(400).json({ status: false, message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await User.create({
            roleId,
            name,
            email,
            number,
            password: hashedPassword,
            role: "admin",
            status
        });

        res.status(201).json({ status: true, message: "Admin user added successfully", admin: newAdmin });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Edit admin user
const editAdminUser = async (req, res) => {
    try {
        const { roleId, name, email, number, status } = req.body;

        // Check duplicates
        if (email) {
            const existingEmail = await User.findOne({ email, role: "admin", _id: { $ne: req.params.id } });
            if (existingEmail) {
                return res.status(400).json({ status: false, message: "Email already exists" });
            }
        }

        const updatedAdmin = await User.findOneAndUpdate(
            { _id: req.params.id, role: "admin" },
            { roleId, name, email, number, status },
            { new: true, runValidators: true }
        );

        if (!updatedAdmin) {
            return res.status(404).json({ status: false, message: "Admin user not found" });
        }

        res.json({ status: true, message: "Admin user updated successfully", admin: updatedAdmin });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get all admin users
const getAdminUsers = async (req, res) => {
    try {
        const admins = await User.find({ role: "admin" }).populate("roleId").sort({ createdAt: -1 });
        res.json({ status: true, message: "Admin users fetched successfully", admins });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get admin user by ID
const getAdminUserById = async (req, res) => {
    try {
        const admin = await User.findOne({ _id: req.params.id, role: "admin" }).populate("roleId");
        if (!admin) {
            return res.status(404).json({ status: false, message: "Admin user not found" });
        }
        res.json({ status: true, message: "Admin user fetched successfully", admin });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Delete admin user
const deleteAdminUser = async (req, res) => {
    try {
        const deletedAdmin = await User.findOneAndDelete({ _id: req.params.id, role: "admin" });
        if (!deletedAdmin) {
            return res.status(404).json({ status: false, message: "Admin user not found" });
        }
        res.json({ status: true, message: "Admin user deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    addAdminUser,
    editAdminUser,
    getAdminUsers,
    getAdminUserById,
    deleteAdminUser
};
