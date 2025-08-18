const User = require("../../models/User");
const Property = require("../../models/Property");

// 📌 Get All Brokers (only those who have properties as Broker)
const getAllBrokers = async (req, res) => {
    try {
        const brokerUserIds = await Property.distinct("createdBy", {
            listingPropertyAs: "Broker"
        });

        if (!brokerUserIds.length) {
            return res.status(200).json({ success: true, data: [] });
        }

        const users = await User.find({ _id: { $in: brokerUserIds } }).lean();

        const brokers = await Promise.all(
            users.map(async (user) => {
                const propertyCount = await Property.countDocuments({
                    createdBy: user._id,
                    listingPropertyAs: "Broker"
                });

                return {
                    id: user._id,
                    role: user.role,
                    name: user.name,
                    email: user.email,
                    phone: user.number,
                    createdPropertyCount: propertyCount,
                    status: user.status,
                    createdAt: user.createdAt,
                };
            })
        );

        res.status(200).json({ success: true, data: brokers });
    } catch (error) {
        console.error("Error fetching brokers:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

// 📌 Get Broker By ID
const getBrokerById = async (req, res) => {
    try {
        const brokerId = req.params.id;

        const user = await User.findById(brokerId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Broker not found" });
        }

        const properties = await Property.countDocuments({
            createdBy: user._id,
            listingPropertyAs: "Broker"
        });

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                role: user.role,
                name: user.name,
                email: user.email,
                phone: user.number,
                createdPropertyCount: properties, // ✅ Owner wali hi properties
                status: user.status,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Error fetching broker by id:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

module.exports = { getAllBrokers, getBrokerById };
