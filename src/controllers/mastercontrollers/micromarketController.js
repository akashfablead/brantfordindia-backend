const Micromarket = require("../../models/Master/Micromarket");

// Add Micromarket
const addMicromarket = async (req, res) => {
    try {
        const { cityId, stateId, name, status } = req.body;

        // Duplicate name check for same city
        const existing = await Micromarket.findOne({
            cityId,
            name: { $regex: new RegExp(`^${name}$`, "i") } // case-insensitive match
        });

        if (existing) {
            return res.status(400).json({
                status: false,
                message: "Micromarket with this name already exists in the selected city"
            });
        }

        const micromarket = new Micromarket({ cityId, stateId, name, status });
        await micromarket.save();

        res.status(201).json({
            status: true,
            message: "Micromarket added successfully",
            data: micromarket
        });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// Edit Micromarket
const editMicromarket = async (req, res) => {
    try {
        const { id } = req.params;
        const { cityId, stateId, name, status } = req.body;

        const micromarket = await Micromarket.findByIdAndUpdate(
            id,
            { cityId, stateId, name, status },
            { new: true }
        );

        if (!micromarket) {
            return res.status(404).json({ status: false, message: "Micromarket not found" });
        }

        res.json({ status: true, message: "Micromarket updated successfully", data: micromarket });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get All Micromarkets
const getMicromarkets = async (req, res) => {
    try {
        const micromarkets = await Micromarket.find()
            .populate("cityId", "name")
            .populate("stateId", "name");
        res.json({ status: true, message: "Micromarkets fetched successfully", data: micromarkets });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// Get All Micromarkets without  token
const getMicromarketswithouttoken = async (req, res) => {
    try {
        const { city } = req.query; // ✅ query param se city id lo

        let filter = {};
        if (city) {
            filter.cityId = city; // ✅ agar city diya ho to filter lagao
        }

        const micromarkets = await Micromarket.find(filter)
            .populate("cityId", "name")
            .populate("stateId", "name");

        res.json({
            status: true,
            message: "Micromarkets fetched successfully",
            data: micromarkets
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// Get Micromarket by ID
const getMicromarketById = async (req, res) => {
    try {
        const micromarket = await Micromarket.findById(req.params.id)
            .populate("cityId", "name")
            .populate("stateId", "name");

        if (!micromarket) {
            return res.status(404).json({ status: false, message: "Micromarket not found" });
        }

        res.json({ status: true, message: "Micromarket fetched successfully", data: micromarket });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Delete Micromarket
const deleteMicromarket = async (req, res) => {
    try {
        const micromarket = await Micromarket.findByIdAndDelete(req.params.id);

        if (!micromarket) {
            return res.status(404).json({ status: false, message: "Micromarket not found" });
        }

        res.json({ status: true, message: "Micromarket deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


module.exports = {
    addMicromarket,
    editMicromarket,
    getMicromarkets,
    getMicromarketswithouttoken,
    getMicromarketById,
    deleteMicromarket
}