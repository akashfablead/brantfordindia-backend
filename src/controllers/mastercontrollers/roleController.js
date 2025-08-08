const Role = require("../../models/Master/Role");


// Add Role
const addRole = async (req, res) => {
    try {
        const { name, navigation, status } = req.body;

        // Check duplicate name (case-insensitive)
        const existingRole = await Role.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
        if (existingRole) {
            return res.status(400).json({ status: false, message: "Role with this name already exists" });
        }

        const role = await Role.create({ name, navigation, status });
        res.status(201).json({ status: true, message: "Role added successfully", role: role });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Edit Role
const editRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, navigation, status } = req.body;

        // Check for duplicate name excluding current role
        const existingRole = await Role.findOne({
            _id: { $ne: id },
            name: { $regex: `^${name}$`, $options: "i" }
        });
        if (existingRole) {
            return res.status(400).json({ status: false, message: "Role with this name already exists" });
        }

        const updatedRole = await Role.findByIdAndUpdate(id, { name, navigation, status }, { new: true });
        if (!updatedRole) {
            return res.status(404).json({ status: false, message: "Role not found" });
        }

        res.json({ status: true, message: "Role updated statusfully", role: updatedRole });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get All Roles
const getRoles = async (req, res) => {
    try {
        let roles = await Role.find().sort({ createdAt: -1 });

        // Convert navigation array to object with index keys
        roles = roles.map(role => {
            const navigationObj = {};
            role.navigation.forEach((nav, index) => {
                navigationObj[index] = nav;
            });

            return {
                ...role._doc,
                navigation: navigationObj
            };
        });

        res.json({ status: true, message: "Roles fetched successfully", roles });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// Get All Roles without token
const getRolesWithoutToken = async (req, res) => {
    try {
        let roles = await Role.find().sort({ createdAt: -1 });

        // Convert navigation array to object with index keys
        roles = roles.map(role => {
            const navigationObj = {};
            role.navigation.forEach((nav, index) => {
                navigationObj[index] = nav;
            });

            return {
                ...role._doc,
                navigation: navigationObj
            };
        });

        res.json({ status: true, message: "Roles fetched successfully", roles: roles });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get Role by ID
const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ status: false, message: "Role not found" });
        }

        // Convert navigation array to object with index keys
        const navigationObj = {};
        role.navigation.forEach((nav, index) => {
            navigationObj[index] = nav;
        });

        const roleData = {
            ...role._doc,
            navigation: navigationObj
        };

        res.json({ status: true, message: "Role fetched successfully", role: roleData });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// Delete Role
const deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).json({ status: false, message: "Role not found" });
        }
        res.json({ status: true, message: "Role deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    addRole, editRole, getRoles, getRolesWithoutToken, getRoleById, deleteRole
};