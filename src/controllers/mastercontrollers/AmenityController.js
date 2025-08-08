const Amenity = require("../../models/Master/Amenity");


// ✅ Add Amenity
const addAmenity = async (req, res) => {
    try {
        const { name, rankAmenity, status } = req.body;
        const image = req.file ? `/uploads/amenities/${req.file.filename}` : null;

        // ✅ Check for duplicate name (case-insensitive)
        const existingAmenity = await Amenity.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
        if (existingAmenity) {
            return res.status(400).json({ message: "Amenity with this name already exists", success: false });
        }

        const amenity = await Amenity.create({ name, rankAmenity, image, status });

        res.status(201).json({
            message: "Amenity added successfully",
            success: true,
            amenity
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};


// ✅ Edit Amenity
const editAmenity = async (req, res) => {
    try {
        const { name, rankAmenity, status } = req.body;
        const image = req.file ? `/uploads/amenities/${req.file.filename}` : undefined;

        const amenity = await Amenity.findById(req.params.id);
        if (!amenity) return res.status(404).json({ message: "Amenity not found", success: false });

        amenity.name = name || amenity.name;
        amenity.rankAmenity = rankAmenity || amenity.rankAmenity;
        amenity.status = status || amenity.status;
        if (image) amenity.image = image;

        await amenity.save();
        res.status(200).json({ message: "Amenity updated successfully", success: true, amenity: amenity });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// ✅ Delete Amenity
const deleteAmenity = async (req, res) => {
    try {
        const amenity = await Amenity.findByIdAndDelete(req.params.id);
        if (!amenity) return res.status(404).json({ message: "Amenity not found", success: false });

        res.status(200).json({ message: "Amenity deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// ✅ Get All Amenities
const getAmenities = async (req, res) => {
    try {
        const baseUrl =
            process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

        const amenities = await Amenity.find().sort({ rankAmenity: 1 });

        const formattedAmenities = amenities.map(a => ({
            ...a._doc,
            image: a.image ? `${process.env.BACKEND_URL}${a.image}` : null
        }));

        res.status(200).json({ message: "Amenities fetched successfully", success: true, amenities: formattedAmenities });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// ✅ Get All Amenities Without token
const getAmenitieswithouttoken = async (req, res) => {
    try {
        const baseUrl =
            process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

        const amenities = await Amenity.find().sort({ rankAmenity: 1 });

        const formattedAmenities = amenities.map(a => ({
            ...a._doc,
            image: a.image ? `${process.env.BACKEND_URL}${a.image}` : null
        }));

        res.status(200).json({ message: "Amenities fetched successfully", success: true, amenities: formattedAmenities });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// ✅ Get Amenity By ID
const getAmenityById = async (req, res) => {
    try {
        const baseUrl =
            process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

        const amenity = await Amenity.findById(req.params.id);
        if (!amenity) return res.status(404).json({ message: "Amenity not found", success: false });

        const amenityObj = amenity.toObject();
        amenityObj.image = amenity.image ? `${process.env.BACKEND_URL}${amenity.image}` : null;

        res.status(200).json({ message: "Amenity fetched successfully", success: true, amenity: amenityObj });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = { addAmenity, editAmenity, deleteAmenity, getAmenities, getAmenitieswithouttoken, getAmenityById };