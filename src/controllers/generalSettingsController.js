const path = require("path");
const GeneralSettings = require("../models/GeneralSettings");

// Helper to build full URL
const getFullUrl = (req, filePath) => {
    if (!filePath) return "";
    return `${req.protocol}://${req.get("host")}/${filePath.replace(/\\/g, "/")}`;
};

// Add or Edit General Settings (Upsert by Type)
const addOrEditGeneralSettings = async (req, res) => {
    try {
        const { type } = req.body;
        if (!type) {
            return res.status(400).json({ status: false, message: "Type is required" });
        }

        let data = req.body;

        // Handle file uploads
        if (req.files) {
            if (req.files.homePageBanner) {
                data.homePageBanner = req.files.homePageBanner[0].path;
            }
            if (req.files.aboutUsImage) {
                data.aboutUsImage = req.files.aboutUsImage[0].path;
            }
        }

        const updated = await GeneralSettings.findOneAndUpdate(
            { type },
            data,
            { new: true, upsert: true }
        );

        // Convert file paths to full URLs for response
        if (updated?.homePageBanner) {
            updated.homePageBanner = getFullUrl(req, updated.homePageBanner);
        }
        if (updated?.aboutUsImage) {
            updated.aboutUsImage = getFullUrl(req, updated.aboutUsImage);
        }

        res.json({ status: true, message: "Settings saved successfully", data: updated });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get All
const getGeneralSettings = async (req, res) => {
    try {
        const list = await GeneralSettings.find();

        // Add full URLs
        const formattedList = list.map(item => ({
            ...item.toObject(),
            homePageBanner: getFullUrl(req, item.homePageBanner),
            aboutUsImage: getFullUrl(req, item.aboutUsImage)
        }));

        res.json({ status: true, data: formattedList });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get by Type
const getGeneralSettingsByType = async (req, res) => {
    try {
        const { type } = req.params;
        const settings = await GeneralSettings.findOne({ type });
        if (!settings) {
            return res.status(404).json({ status: false, message: "Not found" });
        }

        const formatted = {
            ...settings.toObject(),
            homePageBanner: getFullUrl(req, settings.homePageBanner),
            aboutUsImage: getFullUrl(req, settings.aboutUsImage)
        };

        res.json({ status: true, data: formatted });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Delete by ID
const deleteGeneralSettings = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await GeneralSettings.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ status: false, message: "Not found" });
        }
        res.json({ status: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    addOrEditGeneralSettings,
    getGeneralSettings,
    getGeneralSettingsByType,
    deleteGeneralSettings
};
