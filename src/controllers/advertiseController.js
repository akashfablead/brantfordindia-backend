const Advertise = require("../models/Advertise");


// Add Advertise
// Add Advertise
const addAdvertise = async (req, res) => {
    try {
        const { type, pageName, propertyType, city, location, title, url, status } = req.body;

        // Check if image is uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const imagePath = `/uploads/advertises/${req.file.filename}`;

        const advertise = await Advertise.create({
            type,
            pageName,
            propertyType,
            city,
            location,
            title,
            url,
            image: imagePath,
            status
        });

        res.status(201).json({
            success: true,
            message: "Advertise added successfully",
            advertise
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Edit Advertise
const editAdvertise = async (req, res) => {
    try {
        const { id } = req.params;

        let updateData = { ...req.body };

        if (req.file) {
            updateData.image = `/uploads/advertises/${req.file.filename}`;
        }

        const advertise = await Advertise.findByIdAndUpdate(id, updateData, { new: true });
        if (!advertise) return res.status(404).json({ success: false, message: "Advertise not found" });

        res.status(200).json({ success: true, message: "Advertise updated successfully", advertise });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Advertises
const getAdvertises = async (req, res) => {
    try {
        const advertises = await Advertise.find()
            .populate("propertyType", "name")
            .populate("city", "name")
            .populate("location", "name")
            .sort({ createdAt: -1 });

        const advertisesWithFullImage = advertises.map(ad => ({
            ...ad._doc,
            image: ad.image ? `${process.env.BACKEND_URL}${ad.image}` : null
        }));

        res.status(200).json({ success: true, message: "Advertises fetched successfully", advertises: advertisesWithFullImage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Advertise by ID
const getAdvertiseById = async (req, res) => {
    try {
        const advertise = await Advertise.findById(req.params.id)
            .populate("propertyType", "name")
            .populate("city", "name")
            .populate("location", "name");

        if (!advertise) return res.status(404).json({ success: false, message: "Advertise not found" });

        res.status(200).json({
            success: true,
            message: "Advertise fetched successfully",
            advertise: {
                ...advertise._doc,
                image: advertise.image ? `${process.env.BACKEND_URL}${advertise.image}` : null
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Advertise
const deleteAdvertise = async (req, res) => {
    try {
        const advertise = await Advertise.findByIdAndDelete(req.params.id);
        if (!advertise) return res.status(404).json({ success: false, message: "Advertise not found" });

        res.status(200).json({ success: true, message: "Advertise deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addAdvertise,
    editAdvertise,
    getAdvertises,
    getAdvertiseById,
    deleteAdvertise
};
