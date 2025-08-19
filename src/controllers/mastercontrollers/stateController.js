const State = require("../../models/Master/State");

// Add State
const addState = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "State name is required", states: false });
        }

        const existingState = await State.findOne({ name });
        if (existingState) {
            return res.status(400).json({ message: "State already exists", states: false });
        }

        const state = new State({ name });
        await state.save();

        res.status(201).json({ message: "State added successfully", state: state, states: true });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message, states: false });
    }
};

// Edit State
const editState = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "State name is required", states: false });
        }

        const state = await State.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!state) {
            return res.status(404).json({ message: "State not found", states: false });
        }

        res.status(200).json({ message: "State updated successfully", state: state, states: true });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message, states: false });
    }
};

// Delete State
const deleteState = async (req, res) => {
    try {
        const { id } = req.params;

        const state = await State.findByIdAndDelete(id);

        if (!state) {
            return res.status(404).json({ message: "State not found", states: false });
        }

        res.status(200).json({ message: "State deleted successfully", states: true });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
            states: false
        });
    }
};

// Get All States
const getStates = async (req, res) => {
    try {
        const states = await State.find().sort({ createdAt: -1 });
        res.status(200).json({
            message: "States fetched successfully",
            data: states,
            status: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
            status: false
        });
    }
};

const getStateswithouttoken = async (req, res) => {
    try {
        const states = await State.find().sort({ createdAt: -1 });


        res.status(200).json({
            message: "States fetched successfully",
            data: states,
            status: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
            status: false
        });
    }
};

module.exports = {
    addState,
    editState,
    getStates,
    deleteState,
    getStateswithouttoken
};