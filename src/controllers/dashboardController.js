const express = require("express");
const PostRequirement = require("../models/Enquiry/PostRequirement");
const Property = require("../models/Property");
const router = express.Router();


// Get dashboard data user
const dashboarduser = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }

        // Fetch properties of the user
        const properties = await Property.find({ createdBy: userId }).lean();

        // Fetch post requirements of the user
        const postRequirements = await PostRequirement.find({ createdBy: userId }).lean();

        // Dashboard stats
        const totalListings = properties.length;
        const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
        const activeEnquiries = properties.reduce((sum, p) => sum + (p.enquiries?.length || 0), 0);

        const response = {
            status: true,
            data: {
                totalListings,
                totalViews,
                activeEnquiries,
                properties,
                postRequirements,
            },
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Server Error" });
    }
};

module.exports = {
    dashboarduser,
};