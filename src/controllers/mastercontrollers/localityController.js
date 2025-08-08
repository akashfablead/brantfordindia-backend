const Locality = require("../../models/Master/Locality");

// Add Locality
const addLocality = async (req, res) => {
    try {
        const { stateId, cityId, microMarketId, name, status } = req.body;

        const existing = await Locality.findOne({ microMarketId, name: { $regex: `^${name}$`, $options: "i" } });
        if (existing) {
            return res.status(400).json({ status: false, message: "Locality with this name already exists in this MicroMarket" });
        }

        const locality = new Locality({ stateId, cityId, microMarketId, name, status });
        await locality.save();

        res.status(201).json({ status: true, message: "Locality added successfully", data: locality });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Edit Locality
const editLocality = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Locality.findByIdAndUpdate(id, req.body, { new: true });

        if (!updated) return res.status(404).json({ status: false, message: "Locality not found" });

        res.status(200).json({ status: true, message: "Locality updated successfully", data: updated });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get All Localities
const getLocalities = async (req, res) => {
    try {
        const { stateId, cityId, microMarketId, status } = req.query;
        const filter = {};
        if (stateId) filter.stateId = stateId;
        if (cityId) filter.cityId = cityId;
        if (microMarketId) filter.microMarketId = microMarketId;
        if (status) filter.status = status;

        const localities = await Locality.find(filter)
            .populate("stateId", "name")
            .populate("cityId", "name")
            .populate("microMarketId", "name");

        res.status(200).json({ status: true, data: localities });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get All Localities without token
const getLocalitieswithouttoken = async (req, res) => {
    try {
        const { stateId, cityId, microMarketId, status } = req.query;
        const filter = {};
        if (stateId) filter.stateId = stateId;
        if (cityId) filter.cityId = cityId;
        if (microMarketId) filter.microMarketId = microMarketId;
        if (status) filter.status = status;

        const localities = await Locality.find(filter)
            .populate("stateId", "name")
            .populate("cityId", "name")
            .populate("microMarketId", "name");

        res.status(200).json({ status: true, data: localities });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get Locality by ID
const getLocalityById = async (req, res) => {
    try {
        const locality = await Locality.findById(req.params.id)
            .populate("stateId", "name")
            .populate("cityId", "name")
            .populate("microMarketId", "name");

        if (!locality) return res.status(404).json({ status: false, message: "Locality not found" });

        res.status(200).json({ status: true, data: locality });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Delete Locality
const deleteLocality = async (req, res) => {
    try {
        const deleted = await Locality.findByIdAndDelete(req.params.id);

        if (!deleted) return res.status(404).json({ status: false, message: "Locality not found" });

        res.status(200).json({ status: true, message: "Locality deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    addLocality,
    editLocality,
    getLocalities,
    getLocalitieswithouttoken,
    getLocalityById,
    deleteLocality
};
