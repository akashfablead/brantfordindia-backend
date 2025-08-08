const User = require("../../models/User");

// GET all users with role = "user"
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }).sort({ createdAt: -1 });
        res.json({ status: true, message: "Users fetched successfully", users: users });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// GET user by ID (role must be "user")
const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, role: "user" });
        if (!user) return res.status(404).json({ status: false, message: "User not found" });

        res.json({ status: true, message: "User fetched successfully", user: user });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// EDIT user by ID (role must be "user")const editUser = async (req, res) => {
const editUser = async (req, res) => {
    try {
        const { name, email, number, status } = req.body;

        // Check for duplicate name
        if (name) {
            const existingName = await User.findOne({ name, role: "user", _id: { $ne: req.params.id } });
            if (existingName) {
                return res.status(400).json({ status: false, message: "Name already exists" });
            }
        }

        // Check for duplicate email
        if (email) {
            const existingEmail = await User.findOne({ email, role: "user", _id: { $ne: req.params.id } });
            if (existingEmail) {
                return res.status(400).json({ status: false, message: "Email already exists" });
            }
        }

        // Check for duplicate number
        if (number) {
            const existingNumber = await User.findOne({ number, role: "user", _id: { $ne: req.params.id } });
            if (existingNumber) {
                return res.status(400).json({ status: false, message: "Phone number already exists" });
            }
        }

        // Update user
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.id, role: "user" },
            { name, email, number, status },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ status: false, message: "User not found or is not a role user" });
        }

        res.json({ status: true, message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// DELETE user (role must be "user")
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ _id: req.params.id, role: "user" });
        if (!deletedUser) return res.status(404).json({ status: false, message: "User not found or is not a role user" });

        res.json({ status: true, message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { getUsers, getUserById, editUser, deleteUser };
