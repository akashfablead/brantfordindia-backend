const PropertyType = require("../../models/Master/PropertyType");

// Add Property Type
const addPropertyType = async (req, res) => {
    try {
        const { name, unitOfMeasurement, status } = req.body;

        // Duplicate name check (case-insensitive)
        const existing = await PropertyType.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
        if (existing) {
            return res.status(400).json({ message: "Property Type with this name already exists", success: false });
        }

        const propertyType = await PropertyType.create({ name, unitOfMeasurement, status });

        res.status(201).json({ message: "Property Type added successfully", success: true, propertyType });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Edit Property Type
const editPropertyType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, unitOfMeasurement, status } = req.body;

        // Check if exists
        const propertyType = await PropertyType.findById(id);
        if (!propertyType) return res.status(404).json({ message: "Property Type not found", success: false });

        // Duplicate name check (excluding current ID)
        const existing = await PropertyType.findOne({
            name: { $regex: `^${name}$`, $options: "i" },
            _id: { $ne: id }
        });
        if (existing) {
            return res.status(400).json({ message: "Property Type with this name already exists", success: false });
        }

        propertyType.name = name;
        propertyType.unitOfMeasurement = unitOfMeasurement;
        propertyType.status = status;

        await propertyType.save();

        res.status(200).json({ message: "Property Type updated successfully", success: true, propertyType });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get all Property Types
const getPropertyTypes = async (req, res) => {
    try {
        const propertyTypes = await PropertyType.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Property Types fetched successfully", success: true, propertyTypes });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Get Property Type by ID
const getPropertyTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const propertyType = await PropertyType.findById(id);
        if (!propertyType) return res.status(404).json({ message: "Property Type not found", success: false });
        res.status(200).json({ message: "Property Type fetched successfully", success: true, propertyType });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// Delete Property Type
const deletePropertyType = async (req, res) => {
    try {
        const { id } = req.params;
        const propertyType = await PropertyType.findByIdAndDelete(id);
        if (!propertyType) return res.status(404).json({ message: "Property Type not found", success: false });
        res.status(200).json({ message: "Property Type deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = {
    addPropertyType,
    editPropertyType,
    getPropertyTypes,
    getPropertyTypeById,
    deletePropertyType
};