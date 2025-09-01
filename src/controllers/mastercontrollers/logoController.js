const Logo = require("../../models/Master/Logo");


// Add or Update Logo
const addOrUpdateLogo = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ status: false, message: "Title is required" });
        }

        if (!req.file) {
            return res.status(400).json({ status: false, message: "Logo image is required" });
        }

        const logoPath = req.file ? `/uploads/logo/${req.file.filename}` : null;

        const logo = await Logo.findOneAndUpdate(
            {},
            { title: title.trim(), image: logoPath },
            { new: true, upsert: true }
        );

        res.json({ status: true, message: "Logo updated successfully", logo });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get Logo
const getLogo = async (req, res) => {
    try {
        const logo = await Logo.findOne();

        // Build full image URL
        const fullImageUrl = logo?.image
            ? `${process.env.BACKEND_URL}${logo.image}`
            : null;


        res.json({
            status: true,
            message: "Logo fetched successfully",
            logo: logo
                ? {
                    _id: logo._id,
                    title: logo.title,
                    image: fullImageUrl
                }
                : null
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    addOrUpdateLogo,
    getLogo
};
