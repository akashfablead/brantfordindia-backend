const ClientSlider = require("../../models/Master/ClientSlider");
const fs = require("fs");
const path = require("path");

// Add Client Slider
const addClientSlider = async (req, res) => {
    try {
        const { altTag, status } = req.body;

        if (!req.file) {
            return res.status(400).json({ status: false, message: "Logo image is required" });
        }
        if (!altTag || !altTag.trim()) {
            return res.status(400).json({ status: false, message: "Alt tag is required" });
        }

        const logoPath = req.file ? `/uploads/client-sliders/${req.file.filename}` : null;

        const slider = await ClientSlider.create({
            logo: logoPath,
            altTag: altTag.trim(),
            status: status || "active"
        });

        res.json({ status: true, message: "Client slider added successfully", slider });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Edit Client Slider
const editClientSlider = async (req, res) => {
    try {
        const { id } = req.params;
        const { altTag, status } = req.body;

        const slider = await ClientSlider.findById(id);
        if (!slider) return res.status(404).json({ status: false, message: "Slider not found" });

        if (req.file) {
            // Delete old image
            if (slider.logo) {
                const oldPath = path.join(__dirname, "../../..", slider.logo);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            slider.logo = `/uploads/client-sliders/${req.file.filename}`;
        }

        if (altTag) slider.altTag = altTag.trim();
        if (status) slider.status = status;

        await slider.save();

        res.json({ status: true, message: "Client slider updated successfully", slider });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get All Sliders
const getAllClientSliders = async (req, res) => {
    try {
        const sliders = await ClientSlider.find();
        const updated = sliders.map(s => ({
            ...s.toObject(),
            logo: s.logo ? `${process.env.BACKEND_URL}${s.logo}` : null
        }));

        res.json({ status: true, message: "Sliders fetched successfully", sliders: updated });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get Slider by ID
const getClientSliderById = async (req, res) => {
    try {
        const { id } = req.params;
        const slider = await ClientSlider.findById(id);
        if (!slider) return res.status(404).json({ status: false, message: "Slider not found" });

        res.json({
            status: true,
            message: "Slider fetched successfully",
            slider: {
                ...slider.toObject(),
                logo: slider.logo ? `${process.env.BACKEND_URL}${slider.logo}` : null
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Delete Slider
const deleteClientSlider = async (req, res) => {
    try {
        const { id } = req.params;
        const slider = await ClientSlider.findById(id);
        if (!slider) return res.status(404).json({ status: false, message: "Slider not found" });

        // Delete image from disk
        if (slider.logo) {
            const oldPath = path.join(__dirname, "../../..", slider.logo);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        await slider.deleteOne();
        res.json({ status: true, message: "Slider deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    addClientSlider,
    editClientSlider,
    getAllClientSliders,
    getClientSliderById,
    deleteClientSlider
};
