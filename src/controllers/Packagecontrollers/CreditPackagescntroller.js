// controllers/packageController.js
const Package = require("../../models/Package/CreditPackages");

// ✅ Create Package
const createPackage = async (req, res) => {
    try {
        const { name, category } = req.body;

        // Check manually if exists
        const existing = await Package.findOne({ name, category });
        if (existing) {
            return res.status(400).json({
                error: `Package with name "${name}" already exists in category "${category}"`,
            });
        }

        const pkg = new Package(req.body);
        await pkg.save();
        res.status(201).json(
            {
                status: true,
                message: "Package created successfully",
                data: pkg,
            }
        );
    } catch (error) {
        // Handle duplicate key error from MongoDB
        if (error.code === 11000) {
            return res.status(400).json({
                error: "Package with same name and category already exists",
            });
        }
        res.status(400).json({ error: error.message });
    }
};


// ✅ Get All Packages
const getPackages = async (req, res) => {
    try {
        const pkgs = await Package.find();
        res.json(
            {
                status: true,
                message: "Packages fetched successfully",
                data: pkgs,
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get Only Active Packages
const getActivePackages = async (req, res) => {
    try {
        const pkgs = await Package.find({ status: "active" });
        res.json(
            {
                status: true,
                message: "Active Packages fetched successfully",
                data: pkgs,
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get Single Package
const getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) return res.status(404).json({ error: "Package not found" });
        res.json(
            {
                status: true,
                message: "Package fetched successfully",
                data: pkg,
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update Package
const updatePackage = async (req, res) => {
    try {
        const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, // Ensures model validations are checked on update
        });

        if (!pkg) {
            return res.status(404).json({ status: false, message: "Package not found" });
        }

        res.json({
            status: true,
            message: "Package updated successfully",
            data: pkg,
        });
    } catch (error) {
        // Handle duplicate key error from MongoDB, similar to createPackage
        if (error.code === 11000) {
            return res.status(400).json({
                status: false,
                message: "A package with the same name and category already exists.",
            });
        }
        // Handle other validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: false, message: error.message });
        }
        res.status(500).json({ status: false, message: error.message });
    }
};

// ✅ Delete Package
const deletePackage = async (req, res) => {
    try {
        const pkg = await Package.findByIdAndDelete(req.params.id);
        if (!pkg) return res.status(404).json({ error: "Package not found" });
        res.json(
            {
                status: true,
                message: "Package deleted successfully",
                data: pkg,
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Toggle Active / Inactive
const togglePackageStatus = async (req, res) => {
    try {
        const { status } = req.body; // 👈 frontend/Postman will send status here

        // Validate input
        if (!["active", "inactive", "pending"].includes(status)) {
            return res.status(400).json({
                status: false,
                message: "Invalid status value. Use 'active' or 'inactive'."
            });
        }

        const pkg = await Package.findById(req.params.id);
        if (!pkg) return res.status(404).json({ error: "Package not found" });

        pkg.status = status; // 👈 set explicitly from request
        await pkg.save();

        res.json({
            status: true,
            message: `Package status updated to "${status}" successfully`,
            data: pkg,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createPackage,
    getPackages,
    getActivePackages,
    getPackageById,
    updatePackage,
    deletePackage,
    togglePackageStatus,
};
