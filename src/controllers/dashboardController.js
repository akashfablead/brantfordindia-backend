const express = require("express");
const PostRequirement = require("../models/Enquiry/PostRequirement");
const Property = require("../models/Property");
const User = require("../models/User");
const City = require("../models/Master/City");
const PropertyEnquiry = require("../models/Enquiry/PropertyEnquiryList");
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


const getDashboardStatsadmin = async (req, res) => {
    try {
        // ---- Properties ----
        const totalProperty = await Property.countDocuments();
        const totalRentProperty = await Property.countDocuments({ type: "rent" });
        const totalSaleProperty = await Property.countDocuments({ type: "sale" });
        const totalVerifiedProperty = await Property.countDocuments({ isVerified: true });
        const totalNewProperty = await Property.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // last 7 days
        });

        // 👇 ye directly owners/brokers ki properties ka count nikalenge
        const totalOwnerProperty = await Property.countDocuments({ listedBy: "owner" });
        const totalBrokerProperty = await Property.countDocuments({ listedBy: "broker" });

        // ---- Cities ----
        const totalCities = await City.countDocuments();

        // ---- Users ----
        const totalUsers = await User.countDocuments();

        const activeUsers = await User.countDocuments({ status: "active" });

        const totalOwners = await Property.countDocuments({ listingPropertyAs: "Owner" });
        const activeOwners = await Property.countDocuments({ listingPropertyAs: "Owner", status: "Approved" });

        const totalBrokers = await Property.countDocuments({ listingPropertyAs: "Broker" });
        const activeBrokers = await Property.countDocuments({ listingPropertyAs: "Broker", status: "Approved" });

        // ---- Enquiries ----
        const totalEnquiries = await PropertyEnquiry.countDocuments();

        // ---- Latest 10 Properties ----
        const propertyList = await Property.countDocuments({ propertyAvailableFor: "Both", status: "Approved" });

        res.json({
            success: true,
            data: {
                totalProperty,
                totalRentProperty,
                totalSaleProperty,
                totalVerifiedProperty,
                totalNewProperty,
                totalOwnerProperty,
                totalBrokerProperty,
                totalCities,
                propertyList,
                enquiries: totalEnquiries,
                totalUsers,
                activeUsers,
                totalOwners,
                activeOwners,
                totalBrokers,
                activeBrokers
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};


module.exports = {
    dashboarduser,
    getDashboardStatsadmin,
};