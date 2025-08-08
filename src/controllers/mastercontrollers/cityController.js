const City = require("../../models/Master/City");

// Add City
const addCity = async (req, res) => {
    try {
        const { stateId, name, footerDescription } = req.body;
        const image = req.file ? `/uploads/cities/${req.file.filename}` : null;

        if (!stateId || !name) {
            return res.status(400).json({ message: "State ID and City Name are required", status: false });
        }

        // Check if same name exists under same state
        const existingCity = await City.findOne({
            stateId,
            name: { $regex: new RegExp(`^${name}$`, "i") } // case-insensitive match
        });

        if (existingCity) {
            return res.status(400).json({ message: "City with this name already exists in the same state", status: false });
        }

        const city = new City({ stateId, name, image, footerDescription });
        await city.save();

        res.status(201).json({ message: "City added successfully", status: true, city });
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
};

// Get All Cities
const getCities = async (req, res) => {
    try {
        const cities = await City.find().populate("stateId").sort({ createdAt: -1 });
        // Add full path for images
        const citiesWithFullPath = cities.map(city => ({
            ...city._doc,
            image: city.image ? `${process.env.BACKEND_URL}${city.image}` : null
        }));

        res.status(200).json({ message: "Cities fetched successfully", states: true, city: citiesWithFullPath });
    } catch (error) {
        res.status(500).json({ message: error.message, states: false });
    }
};

// Get All Cities Without Token
const getCitieswithouttoken = async (req, res) => {
    try {
        const cities = await City.find().populate("stateId").sort({ createdAt: -1 });
        // Add full path for images
        const citiesWithFullPath = cities.map(city => ({
            ...city._doc,
            image: city.image ? `${process.env.BACKEND_URL}${city.image}` : null
        }));

        res.status(200).json({ message: "Cities fetched successfully", states: true, city: citiesWithFullPath });
    } catch (error) {
        res.status(500).json({ message: error.message, states: false });
    }
};

// Get City by ID
const getCityById = async (req, res) => {
    try {
        const city = await City.findById(req.params.id).populate("stateId");
        if (!city) {
            return res.status(404).json({ message: "City not found", states: false });
        }

        const cityWithFullPath = {
            ...city._doc,
            image: city.image ? `${process.env.BACKEND_URL}${city.image}` : null
        };

        res.status(200).json({
            message: "City fetched successfully",
            states: true,
            city: cityWithFullPath
        });
    } catch (error) {
        res.status(500).json({ message: error.message, states: false });
    }
};


// Edit City
const editCity = async (req, res) => {
    try {
        const { stateId, name, footerDescription } = req.body;
        const image = req.file ? `/uploads/cities/${req.file.filename}` : undefined;

        const updateData = { stateId, name, footerDescription };
        if (image) updateData.image = image;

        const city = await City.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!city) return res.status(404).json({ message: "City not found", states: false });

        const cityWithFullPath = {
            ...city._doc,
            image: city.image ? `${process.env.BACKEND_URL}${city.image}` : null
        };

        res.status(200).json({ message: "City updated successfully", states: true, city: cityWithFullPath });
    } catch (error) {
        res.status(500).json({ message: error.message, states: false });
    }
};

// Delete City
const deleteCity = async (req, res) => {
    try {
        const city = await City.findByIdAndDelete(req.params.id);
        if (!city) return res.status(404).json({ message: "City not found", states: false });

        res.status(200).json({ message: "City deleted successfully", states: true });
    } catch (error) {
        res.status(500).json({ message: error.message, states: false });
    }
};

module.exports = {
    addCity, getCities, getCitieswithouttoken, getCityById, editCity, deleteCity
};