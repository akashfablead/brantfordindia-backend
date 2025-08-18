const mongoose = require("mongoose");
const Property = require("../../models/Property");
const User = require("../../models/User");

// 📌 Get All Owners (only those users who have properties as Owner)
const getAllOwners = async (req, res) => {
    try {
        // Step 1: Property se sabhi unique users nikalo jinhone "Owner" ke under property banayi
        const ownerUserIds = await Property.distinct("createdBy", {
            listingPropertyAs: "Owner"
        });

        // Agar koi property nahi mili
        if (!ownerUserIds.length) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Step 2: Sirf wahi users fetch karo jinke IDs above list me hain
        const users = await User.find({ _id: { $in: ownerUserIds } }).lean();

        // Step 3: Har user ka property count nikalna (sirf "Owner" wali properties)
        const owners = await Promise.all(
            users.map(async (user) => {
                const propertyCount = await Property.countDocuments({
                    createdBy: user._id,
                    listingPropertyAs: "Owner" // 🔥 Sirf Owner ki property count hogi
                });


                return {
                    id: user._id,
                    role: user.role,
                    name: user.name,
                    email: user.email,
                    phone: user.number,
                    createdPropertyCount: propertyCount, // ✅ Sirf Owner wali properties
                    status: user.status,
                    createdAt: user.createdAt,
                };
            })
        );

        res.status(200).json({ success: true, data: owners });
    } catch (error) {
        console.error("Error fetching owners:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

// 📌 Get Single Owner by ID
const getOwnerById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).lean();

        if (!user) {
            return res.status(404).json({ success: false, message: "Owner not found" });
        }

        // ✅ Count only "Owner" properties
        const propertyCount = await Property.countDocuments({
            createdBy: user._id,
            listingPropertyAs: "Owner"
        });

        const owner = {
            id: user._id,
            role: user.role,
            name: user.name,
            email: user.email,
            phone: user.number,
            createdPropertyCount: propertyCount, // ✅ Owner wali hi properties
            status: user.status,
            createdAt: user.createdAt,
        };

        res.status(200).json({ success: true, data: owner });
    } catch (error) {
        console.error("Error fetching owner by id:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

module.exports = {
    getAllOwners,
    getOwnerById,
};
