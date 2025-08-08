const UnitType = require("../../models/Master/UnitType");


// Add Unit Type
const addUnitType = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Duplicate name check (case-insensitive)
        const existing = await UnitType.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
        if (existing) {
            return res.status(400).json({ message: "Unit Type with this name already exists", success: false });
        }

        const unitType = await UnitType.create({ name, status });

        res.status(201).json({ message: "Unit Type added successfully", success: true, unitType });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Edit Unit Type
const editUnitType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const unitType = await UnitType.findById(id);
        if (!unitType) return res.status(404).json({ message: "Unit Type not found", success: false });

        // Duplicate check excluding current ID
        const existing = await UnitType.findOne({
            name: { $regex: `^${name}$`, $options: "i" },
            _id: { $ne: id }
        });
        if (existing) {
            return res.status(400).json({ message: "Unit Type with this name already exists", success: false });
        }

        unitType.name = name;
        unitType.status = status;
        await unitType.save();

        res.status(200).json({ message: "Unit Type updated successfully", success: true, unitType });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get All Unit Types
const getUnitTypes = async (req, res) => {
    try {
        const unitTypes = await UnitType.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Unit Types fetched successfully", success: true, unitTypes: unitTypes });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get All Unit Types without token
const getUnitTypesWithoutToken = async (req, res) => {
    try {
        const unitTypes = await UnitType.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Unit Types fetched successfully", success: true, unitTypes: unitTypes });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get Unit Type by ID
const getUnitTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const unitType = await UnitType.findById(id);
        if (!unitType) return res.status(404).json({ message: "Unit Type not found", success: false });

        res.status(200).json({ message: "Unit Type fetched successfully", success: true, unitType });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Delete Unit Type
const deleteUnitType = async (req, res) => {
    try {
        const { id } = req.params;
        const unitType = await UnitType.findByIdAndDelete(id);
        if (!unitType) return res.status(404).json({ message: "Unit Type not found", success: false });

        res.status(200).json({ message: "Unit Type deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = {
    addUnitType,
    editUnitType,
    getUnitTypes,
    getUnitTypesWithoutToken,
    getUnitTypeById,
    deleteUnitType
};
