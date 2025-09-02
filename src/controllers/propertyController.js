const slugify = require("slugify");
const Property = require("../models/Property");
const { default: mongoose } = require("mongoose");
const PropertyType = require("../models/Master/PropertyType");
const City = require("../models/Master/City");
const Micromarket = require("../models/Master/Micromarket");
const Locality = require("../models/Master/Locality");
const PropertyEnquiryList = require("../models/Enquiry/PropertyEnquiryList");
const Favourites = require("../models/Favourites");
const Compare = require("../models/Compare");

// 📌 Convert amenities image to full URL

const formatAmenitiesWithFullUrl = (req, property) => {
    // Ensure property is a plain object
    const formatted = { ...property };

    // Helper function to prepend the backend URL
    const getFullUrl = (path) => {
        if (!path) return null;
        return path.startsWith('http') ? path : `${process.env.BACKEND_URL}${path}`;
    };

    // Format amenities images
    if (formatted.amenities && Array.isArray(formatted.amenities)) {
        formatted.amenities = formatted.amenities.map(a => {
            if (a.amenityid && a.amenityid.image) {
                a.amenityid.image = getFullUrl(a.amenityid.image);
            }
            return a;
        });
    }

    // Format city image (single object case)
    if (formatted.city && formatted.city.image) {
        formatted.city.image = getFullUrl(formatted.city.image);
    }

    // If city is an array (just in case some APIs return it that way)
    if (Array.isArray(formatted.city)) {
        formatted.city = formatted.city.map(c => {
            if (c.image) {
                c.image = getFullUrl(c.image);
            }
            return c;
        });
    }

    // Format property images
    if (formatted.propertyImages && Array.isArray(formatted.propertyImages)) {
        formatted.propertyImages = formatted.propertyImages.map(image => getFullUrl(image));
    }

    // Format featured images
    if (formatted.featuredImages && Array.isArray(formatted.featuredImages)) {
        formatted.featuredImages = formatted.featuredImages.map(image => getFullUrl(image));
    }

    // Format property videos
    if (formatted.propertyVideos && Array.isArray(formatted.propertyVideos)) {
        formatted.propertyVideos = formatted.propertyVideos.map(video => getFullUrl(video));
    }

    return formatted;
};



function parseArrayFields(reqBody, fieldNames) {
    let arr = [];

    // Support both with/without [] in key
    const keys = fieldNames.map(f => f.replace("[]", ""));

    // Case 1: If first field exists and is an array
    if (Array.isArray(reqBody[fieldNames[0]]) || Array.isArray(reqBody[keys[0]])) {
        const length = (reqBody[fieldNames[0]] || reqBody[keys[0]]).length;
        for (let i = 0; i < length; i++) {
            let obj = {};
            fieldNames.forEach(field => {
                const cleanKey = field.replace("[]", "");
                const value = reqBody[field] || reqBody[cleanKey];
                if (value && Array.isArray(value) && value[i] !== undefined) {
                    obj[cleanKey] = value[i];
                }
            });
            if (Object.keys(obj).length) arr.push(obj);
        }
    }
    // Case 2: JSON string
    else if (typeof reqBody[fieldNames[0]] === "string" && reqBody[fieldNames[0]].trim().startsWith("[")) {
        try {
            arr = JSON.parse(reqBody[fieldNames[0]]);
        } catch (err) {
            console.error(`Error parsing JSON for ${fieldNames[0]}:`, err);
        }
    }
    // Case 3: Single value
    else {
        let obj = {};
        fieldNames.forEach(field => {
            const cleanKey = field.replace("[]", "");
            if (reqBody[field] !== undefined || reqBody[cleanKey] !== undefined) {
                obj[cleanKey] = reqBody[field] || reqBody[cleanKey];
            }
        });
        if (Object.keys(obj).length) arr.push(obj);
    }

    return arr;
}

const addProperty = async (req, res) => {
    try {
        const {
            title,
            listingPropertyAs,
            propertyAvailableFor,
            listingType,
            state,
            city,
            buildingName,
            buildingStatus,
            proposedAvailabilityDate,
            displayIn,
            propertyType,
            micromarket,
            locality,
            address,
            latitude,
            longitude,
            pinCode,
            wingtower,
            statusoftheproperty,
            unitNo,
            floorNo,
            unitType,
            landmark,
            yearofconstruction,
            rent,
            Deposit,
            areatype,
            totalArea,
            minimumLockInMonths,
            modificationofinteriors,
            washrooms,
            pantrycafeteria,
            maintenancecharges,
            maintenanceperiod,
            dedicatedcarparking,
            dedicatedbikeparking,
            openToNegotiation,
            openToBrokers,
            expectedprice,
            ratepersqft,
            preleased,
            description,
            videoUrl,
            availableCapacity,
            flexiopendesks,
            dedicateddesks,
            managedcabinsofcapacity,
            meetingroomofcapacity,
            conferenceroomcapacity,
            dimensions,
            floorsallowed,
            ownership,
            roadwidth
        } = req.body;
        const slug = slugify(title, { lower: true, strict: true });

        // ✅ Check if title slug already exists
        const existingProperty = await Property.findOne({ slug });
        if (existingProperty) {
            return res.status(400).json({
                status: false,
                message: `A property with title "${title}" already exists. Please choose a different title.`
            });
        }

        // ✅ Fetch PropertyType, City, and Micromarket docs
        const propertyTypeDoc = await PropertyType.findById(propertyType);
        const cityDoc = await City.findById(city);
        const microMarketDoc = await Micromarket.findById(micromarket);

        if (!propertyTypeDoc || !cityDoc) {
            return res.status(400).json({ status: false, message: "Invalid PropertyType or City" });
        }
        if (!microMarketDoc) {
            return res.status(400).json({ status: false, message: "Invalid Micromarket" });
        }

        // ✅ Create both slugs
        const PropertyCitySlug = slugify(
            `${propertyTypeDoc.name} of ${cityDoc.name}`,
            { lower: true, strict: true }
        );

        const PropertyMicromarketSlug = slugify(
            `${propertyTypeDoc.name} of ${microMarketDoc.name}`,
            { lower: true, strict: true }
        );

        // Parse arrays from the request body
        const availableOptionsArr = parseArrayFields(req.body, ["option[]"]);
        const amenitiesArray = parseArrayFields(req.body, ["amenityid[]"]);


        // Create a new property instance
        const newProperty = new Property({
            title,
            slug,
            PropertyCitySlug, // ✅ new slug stored in PropertyCitySlug
            PropertyMicromarketSlug, // 👈 new micromarket slug here
            listingPropertyAs,
            propertyAvailableFor,
            listingType,
            state,
            city,
            buildingName,
            buildingStatus,
            proposedAvailabilityDate,
            displayIn,
            propertyType,
            micromarket,
            locality,
            address,
            wingtower,
            latitude,
            longitude,
            pinCode,
            unitNo,
            floorNo,
            unitType,
            yearofconstruction,
            landmark,
            areatype,
            totalArea,
            rent,
            Deposit,
            minimumLockInMonths,
            modificationofinteriors,
            availableCapacity,
            amenities: amenitiesArray,
            washrooms,
            pantrycafeteria,
            maintenancecharges,
            maintenanceperiod,
            dedicatedcarparking,
            dedicatedbikeparking,
            openToBrokers,
            openToNegotiation,
            expectedprice,
            ratepersqft,
            preleased,
            statusoftheproperty,
            description,
            availableCapacity,
            flexiopendesks,
            dedicateddesks,
            managedcabinsofcapacity,
            meetingroomofcapacity,
            conferenceroomcapacity,
            dimensions,
            floorsallowed,
            ownership,
            roadwidth,
            propertyImages: req.files["propertyImages"]?.map(f => `/${f.path.replace(/\\/g, "/")}`) || [],
            featuredImages: req.files["featuredImages"]?.map(f => `/${f.path.replace(/\\/g, "/")}`) || [],
            propertyVideos: req.files["propertyVideos"]?.map(f => `/${f.path.replace(/\\/g, "/")}`) || [],
            videoUrl,
            availableOptions: availableOptionsArr,
            createdBy: req.user?._id || req.user?.id || req.user?.userId
        });

        // Save the property
        const savedProperty = await newProperty.save();
        const populatedProperty = await Property.findById(savedProperty._id)
            .populate("state city propertyType micromarket locality")
            .lean(); // Use lean() for plain JS objects

        res.status(201).json({
            status: true,
            message: "Property added successfully",
            property: populatedProperty
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


const editProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const availableOptionsArr = parseArrayFields(req.body, ["option[]"]);
        const amenitiesArray = parseArrayFields(req.body, ["amenityid[]"]);

        const updatedData = {
            ...req.body,
            availableOptions: availableOptionsArr,
            amenities: amenitiesArray,
        };

        if (req.files["propertyImages"]) {
            updatedData.propertyImages = req.files["propertyImages"].map(f => `/${f.path.replace(/\\/g, "/")}`);
        }
        if (req.files["featuredImages"]) {
            updatedData.featuredImages = req.files["featuredImages"].map(f => `/${f.path.replace(/\\/g, "/")}`);
        }
        if (req.files["propertyVideos"]) {
            updatedData.propertyVideos = req.files["propertyVideos"].map(f => `/${f.path.replace(/\\/g, "/")}`);
        }

        const property = await Property.findByIdAndUpdate(id, updatedData, { new: true });
        if (!property) {
            return res.status(404).json({ status: false, message: "Property not found" });
        }

        res.status(200).json({ status: true, message: "Property updated successfully", property });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// 📌 Change Status (Approve / Reject / Pending)
const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ status: false, message: "Invalid status" });
        }

        const property = await Property.findByIdAndUpdate(id, { status }, { new: true });
        if (!property) return res.status(404).json({ status: false, message: "Property not found" });

        res.json({ status: true, message: "Status updated successfully", property });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// 📌 Get Properties by User (Authenticated)
const getPropertiesByUser = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized: User not authenticated",
            });
        }


        // Fetch user properties
        const properties = await Property.find({ createdBy: userId })
            .populate("state city propertyType micromarket locality")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity",
            })
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for plain JS objects


        if (!properties.length) {
            return res.status(200).json({
                status: true,
                message: "No properties found for this user",
                properties: [],
                activeEnquiries: 0,
                totalListings: 0,
                revenueGenerated: 0,
            });
        }

        // Format properties
        const formattedProperties = properties.map((property) =>
            formatAmenitiesWithFullUrl(req, property)
        );

        // Total listings
        const totalListings = properties.length;

        const propertyIds = properties.map(p => p._id);
        const activeEnquiries = await PropertyEnquiryList.countDocuments({
            property: { $in: propertyIds },
            status: "active",
        });

        // Revenue generated (assuming 'revenue' field exists on Property)
        const revenueGenerated = properties.reduce((sum, prop) => sum + (prop.revenue || 0), 0);


        res.status(200).json({
            status: true,
            message: "User properties fetched successfully",
            properties: formattedProperties,
            activeEnquiries,
            totalListings,
            revenueGenerated,
        });
    } catch (error) {
        console.error("Error fetching user properties:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};


const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find({ status: "Approved" })
            .populate("state city propertyType micromarket locality")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity"
            })
            .sort({ createdAt: -1 });

        const userId = req.user?._id || req.user?.id || req.user?.userId;
        let favIds = [];
        let compareIds = [];

        if (userId) {
            const favs = await Favourites.find({ userId }).select("propertyId");
            favIds = favs.map(f => f.propertyId.toString());

            const compares = await Compare.find({ userId }).select("propertyId");
            compareIds = compares.map(c => c.propertyId.toString());
        }

        const finalProps = properties.map(p => {
            const obj = formatAmenitiesWithFullUrl(req, p.toObject());
            obj.favouritestatus = favIds.includes(p._id.toString()) ? 1 : 0;
            obj.compareStatus = compareIds.includes(p._id.toString()) ? 1 : 0;
            return obj;
        });

        res.json({
            status: true,
            message: "Properties fetched successfully",
            properties: finalProps
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// const getPropertiesByCategory = async (req, res) => {
//     try {
//         const { category } = req.query; // "recent" | "mostSearchedOffice" | "mostSearchedResidential"

//         let filter = { status: "Approved" };
//         let sort = {};
//         let limit = 10;

//         // Apply category-specific logic
//         if (category === "recent") {
//             filter.listingType = "Coworking"; // Office spaces (coworking only)
//             sort = { createdAt: -1 };
//         }
//         else if (category === "mostSearchedOffice") {
//             filter.listingType = "Office"; // Office spaces
//             sort = { searchCount: -1 }; // Assume you store search count in property
//         }
//         else if (category === "mostSearchedResidential") {
//             filter.listingType = "Residential"; // Residential spaces
//             sort = { searchCount: -1 };
//         }
//         else {
//             return res.status(400).json({
//                 status: false,
//                 message: "Invalid category type"
//             });
//         }

//         // Exclude own properties if user logged in
//         const userId = req.user?._id || req.user?.id || req.user?.userId;
//         if (userId && mongoose.Types.ObjectId.isValid(userId)) {
//             filter.createdBy = { $ne: new mongoose.Types.ObjectId(userId) };
//         }

//         let properties = await Property.find(filter)
//             .populate("state city propertyType micromarket locality")
//             .populate({ path: "amenities.amenityid", model: "Amenity" })
//             .sort(sort)
//             .limit(limit)
//             .lean();

//         // Favourite & Compare check
//         if (properties.length > 0 && userId && mongoose.Types.ObjectId.isValid(userId)) {
//             const propertyIds = properties.map(p => p._id);

//             const favourites = await Favourites.find({
//                 userId: new mongoose.Types.ObjectId(userId),
//                 propertyId: { $in: propertyIds }
//             }).lean();

//             const favouriteSet = new Set(favourites.map(f => String(f.propertyId)));

//             const compareList = await Compare.find({
//                 userId: new mongoose.Types.ObjectId(userId),
//                 propertyId: { $in: propertyIds }
//             }).lean();

//             const compareSet = new Set(compareList.map(c => String(c.propertyId)));

//             properties = properties.map(p => ({
//                 ...p,
//                 favouritestatus: favouriteSet.has(String(p._id)) ? 1 : 0,
//                 compareStatus: compareSet.has(String(p._id)) ? 1 : 0
//             }));
//         } else {
//             properties = properties.map(p => ({
//                 ...p,
//                 favouritestatus: 0,
//                 compareStatus: 0
//             }));
//         }

//         res.json({
//             status: true,
//             message: `${category} properties fetched successfully`,
//             properties
//         });
//     } catch (error) {
//         console.error("Error fetching properties:", error);
//         res.status(500).json({ status: false, message: error.message });
//     }
// };

const getPropertiesByCategory = async (req, res) => {
    try {
        const { category } = req.query; // "recent" | "mostSearchedOffice" | "mostSearchedResidential"
        let filter = { status: "Approved" };
        let sort = {};
        let limit = 10;

        // Apply category-specific logic
        if (category === "recent") {
            filter.listingType = "Coworking"; // Office spaces (coworking only)
            sort = { createdAt: -1 };
        } else if (category === "mostSearchedOffice") {
            filter.listingType = "Office"; // Office spaces
            sort = { searchCount: -1 }; // Assume you store search count in property
        } else if (category === "mostSearchedResidential") {
            filter.listingType = "Residential"; // Residential spaces
            sort = { searchCount: -1 };
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid category type"
            });
        }

        // Exclude own properties if user logged in
        const userId = req.user?._id || req.user?.id || req.user?.userId;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            filter.createdBy = { $ne: new mongoose.Types.ObjectId(userId) };
        }

        // Fetch properties
        let properties = await Property.find(filter)
            .populate("state city propertyType micromarket locality")
            .populate({ path: "amenities.amenityid", model: "Amenity" })
            .sort(sort)
            .limit(limit)
            .lean();

        // Format properties with full URLs
        properties = properties.map(property => formatAmenitiesWithFullUrl(req, property));

        // Favourite & Compare check
        if (properties.length > 0 && userId && mongoose.Types.ObjectId.isValid(userId)) {
            const propertyIds = properties.map(p => p._id);
            const favourites = await Favourites.find({
                userId: new mongoose.Types.ObjectId(userId),
                propertyId: { $in: propertyIds }
            }).lean();
            const favouriteSet = new Set(favourites.map(f => String(f.propertyId)));

            const compareList = await Compare.find({
                userId: new mongoose.Types.ObjectId(userId),
                propertyId: { $in: propertyIds }
            }).lean();
            const compareSet = new Set(compareList.map(c => String(c.propertyId)));

            properties = properties.map(p => ({
                ...p,
                favouritestatus: favouriteSet.has(String(p._id)) ? 1 : 0,
                compareStatus: compareSet.has(String(p._id)) ? 1 : 0
            }));
        } else {
            properties = properties.map(p => ({
                ...p,
                favouritestatus: 0,
                compareStatus: 0
            }));
        }

        res.json({
            status: true,
            message: `${category} properties fetched successfully`,
            properties
        });
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

// 📌 Get All Properties 
const getstatusProperties = async (req, res) => {
    try {
        const filter = {};

        // ✅ Apply status filter if provided, else default to Approved
        filter.status = req.query.status || "Approved";

        // ✅ Exclude properties created by the current user
        const userId = req.user?._id || req.user?.id || req.user?.userId;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            filter.createdBy = { $ne: new mongoose.Types.ObjectId(userId) };
        }

        let properties = await Property.find(filter)
            .populate("state city propertyType micromarket locality")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity"
            })
            .lean(); // Use lean() for plain JS objects;

        if (properties.length > 0) {
            // ✅ Get all propertyIds from fetched properties
            const propertyIds = properties.map(p => p._id);

            // ✅ Fetch all favourites for this user
            const favourites = await Favourites.find({
                userId: new mongoose.Types.ObjectId(userId),
                propertyId: { $in: propertyIds }
            }).lean();

            // ✅ Convert to Set
            const favouriteSet = new Set(favourites.map(f => String(f.propertyId)));

            // ✅ Inject favouritestatus + compareStatus
            properties = properties.map(p => ({
                ...p,
                favouritestatus: favouriteSet.has(String(p._id)) ? 1 : 0,
                compareStatus: p.compareStatus || 0
            }));
        } else {
            properties = properties.map(p => ({
                ...p,
                favouritestatus: 0,
                compareStatus: 0
            }));
        }

        res.json({
            status: true,
            message: "Properties fetched successfully",
            properties: properties || []
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// 📌 Get All Properties with Filters and Sorting
const getAllPropertiesfilter = async (req, res) => {
    try {
        let {
            category, // propertyType or listingType depending on your use case
            city,
            location, // locality or micromarket
            minPrice,
            maxPrice,
            sortPrice, // "lowToHigh" | "highToLow"
            sortTitle // "AtoZ" | "ZtoA"
        } = req.query;

        const filter = {
            status: "Approved" // Only show properties with status "Approved"
        };

        // If logged in → exclude user's own properties
        const userId = req.user?._id || req.user?.id || req.user?.userId;
        if (userId) {
            filter.createdBy = { $ne: new mongoose.Types.ObjectId(userId) };
        }

        // Filter: Category
        if (category) {
            filter.listingType = category; // OR filter.propertyType = categoryId
        }

        // Filter: City
        if (city) {
            filter.city = city; // Expect ObjectId from client
        }

        // Filter: Location
        if (location) {
            filter.locality = location; // or micromarket depending on your structure
        }

        // Filter: Price per Seat (coworking)
        if (minPrice || maxPrice) {
            filter.quotedAmountPerSeat = {};
            if (minPrice) filter.quotedAmountPerSeat.$gte = parseFloat(minPrice);
            if (maxPrice) filter.quotedAmountPerSeat.$lte = parseFloat(maxPrice);
        }

        // Sorting
        let sort = {};
        if (sortPrice) {
            if (sortPrice === "lowToHigh") sort.quotedAmountPerSeat = 1;
            if (sortPrice === "highToLow") sort.quotedAmountPerSeat = -1;
        }

        if (sortTitle) {
            if (sortTitle === "AtoZ") sort.title = 1;
            if (sortTitle === "ZtoA") sort.title = -1;
        }

        let properties = await Property.find(filter)
            .populate("state city propertyType micromarket locality")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity"
            })
            .sort(sort)
            .lean(); // Use lean() for plain JS objects;

        properties = properties.map(p => formatAmenitiesWithFullUrl(req, p));

        if (properties.length === 0) {
            return res.status(404).json({ status: false, message: "No properties found" });
        }

        res.json({ status: true, message: "Properties fetched successfully", properties });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};



// 📌 Get Property by Id
const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        let property = await Property.findById(id)
            .populate("state city propertyType micromarket locality")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity"
            });

        if (!property) {
            return res.status(404).json({ status: false, message: "Property not found" });
        }

        // ✅ Convert to plain object for safe modifications
        property = property.toObject();

        // ✅ Inject favouritestatus
        let favouritestatus = 0;
        const userId = req.user?._id || req.user?.id || req.user?.userId;

        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            const fav = await Favourites.findOne({
                userId: new mongoose.Types.ObjectId(userId),
                propertyId: property._id
            }).lean();

            if (fav) favouritestatus = 1;
        }

        // ✅ Format amenities with full URL
        property = formatAmenitiesWithFullUrl(req, property);

        // ✅ Inject both statuses
        property.favouritestatus = favouritestatus;
        property.compareStatus = property.compareStatus || 0;

        res.json({
            status: true,
            message: "Property fetched successfully",
            property
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


const getPropertyBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        let property = await Property.findOne({ slug })
            .populate("state city propertyType micromarket locality")
            .populate({ path: "amenities.amenityid", model: "Amenity" })
            .lean();

        if (!property) {
            return res.status(404).json({
                status: false,
                message: "Property not found or not approved"
            });
        }

        // Format amenities with full URL
        property = formatAmenitiesWithFullUrl(req, property);

        // Inject favorite and compare status
        const userId = req.user?._id || req.user?.id || req.user?.userId;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            const fav = await Favourites.findOne({ userId, propertyId: property._id }).lean();
            const compare = await Compare.findOne({ userId, propertyId: property._id }).lean();

            property.favouritestatus = fav ? 1 : 0;
            property.compareStatus = compare ? 1 : 0;
        } else {
            // Default status for unauthenticated users
            property.favouritestatus = 0;
            property.compareStatus = 0;
        }

        res.json({
            status: true,
            message: "Property fetched successfully",
            property
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// 📌 Get Properties by PropertyCitySlug
const getPropertiesByCitySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // Fetch properties using correct field name
        let properties = await Property.find({
            PropertyCitySlug: slug,   // ✅ exact match
            status: "Approved"
        })
            .populate("state city propertyType micromarket locality")
            .populate({ path: "amenities.amenityid", model: "Amenity" })
            .sort({ createdAt: -1 });


        if (!properties || properties.length === 0) {
            return res.status(200).json({
                data: [],
                status: true,
                message: `No properties found for city slug: ${slug}`,
            });
        }

        const userId = req.user?._id || req.user?.id || req.user?.userId;
        let favIds = [], compareIds = [];

        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            const favs = await Favourites.find({ userId }).select("propertyId").lean();
            const compares = await Compare.find({ userId }).select("propertyId").lean();

            favIds = favs.map(f => f.propertyId.toString());
            compareIds = compares.map(c => c.propertyId.toString());
        }

        // ✅ Format amenities + inject status
        properties = properties.map(p => {
            const obj = formatAmenitiesWithFullUrl(req, p.toObject ? p.toObject() : p);
            obj.favouritestatus = favIds.includes(p._id.toString()) ? 1 : 0;
            obj.compareStatus = compareIds.includes(p._id.toString()) ? 1 : 0;
            return obj;
        });

        return res.status(200).json({
            status: true,
            message: "Properties fetched successfully",
            data: properties,
        });
    } catch (error) {
        console.error("❌ Error in getPropertiesByCitySlug:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};

const getPropertiesByMicromarketSlug = async (req, res) => {
    try {
        const { slug } = req.params;


        // ✅ Directly find properties by PropertyMicromarketSlug
        let properties = await Property.find({
            PropertyMicromarketSlug: slug,  // Target this field
            status: "Approved"
        })
            .populate("state city propertyType micromarket locality")
            .populate({ path: "amenities.amenityid", model: "Amenity" })
            .sort({ createdAt: -1 });


        if (!properties || properties.length === 0) {
            return res.status(200).json({
                data: [],
                status: true,
                message: `No properties found for micromarket slug: ${slug}`,
            });
        }

        // ✅ Inject favourite and compare status
        const userId = req.user?._id || req.user?.id || req.user?.userId;
        let favIds = [], compareIds = [];

        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            const favs = await Favourites.find({ userId }).select("propertyId").lean();
            const compares = await Compare.find({ userId }).select("propertyId").lean();

            favIds = favs.map(f => f.propertyId.toString());
            compareIds = compares.map(c => c.propertyId.toString());
        }

        // ✅ Format amenities + inject status
        properties = properties.map(p => {
            const obj = formatAmenitiesWithFullUrl(req, p.toObject ? p.toObject() : p);
            obj.favouritestatus = favIds.includes(p._id.toString()) ? 1 : 0;
            obj.compareStatus = compareIds.includes(p._id.toString()) ? 1 : 0;
            return obj;
        });

        return res.status(200).json({
            status: true,
            message: "Properties fetched successfully",
            data: properties,
        });
    } catch (error) {
        console.error("❌ Error in getPropertiesByMicromarketSlug:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};




// 📌 Delete Property
const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findByIdAndDelete(id);
        if (!property) return res.status(404).json({ status: false, message: "Property not found" });

        res.json({ status: true, message: "Property deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// 📌 Delete Available Option
const deleteAvailableOption = async (req, res) => {
    try {
        const { id, optionId } = req.params;
        const property = await Property.findById(id);
        if (!property) return res.status(404).json({ status: false, message: "Property not found" });

        property.availableOptions = property.availableOptions.filter(opt => opt._id.toString() !== optionId);
        await property.save();

        res.json({ status: true, message: "Available option deleted successfully", property });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// 📌 Delete Property Media (propertyVideos , featuredImages , propertyImages)
const deletePropertyMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, index } = req.body;

        // Validate the type
        if (!["featuredImages", "propertyImages", "propertyVideos"].includes(type)) {
            return res.status(400).json({
                status: false,
                message: "Invalid media type. Must be one of: featuredImages, propertyImages, propertyVideos",
            });
        }

        // Find the property
        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({
                status: false,
                message: "Property not found",
            });
        }

        // Check if the index is valid
        if (!property[type] || index < 0 || index >= property[type].length) {
            return res.status(400).json({
                status: false,
                message: "Invalid index or media type",
            });
        }

        // Remove the media at the specified index
        property[type].splice(index, 1);

        // Save the updated property
        await property.save();

        res.status(200).json({
            status: true,
            message: "Media deleted successfully",
            property,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// 📌 Toggle Favourite (Add/Remove)
const toggleFavourite = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const userId = req.user?._id || req.user?.id || req.user?.userId;

        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            return res.status(400).json({ status: false, message: "Invalid property ID" });
        }

        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ status: false, message: "Property not found" });
        }

        // Check if already in favourites
        const existing = await Favourites.findOne({ userId, propertyId });

        if (existing) {
            // Remove from favourites
            await Favourites.deleteOne({ _id: existing._id });
            return res.status(200).json({
                status: true,
                message: "Property removed from favourites",
                favouritestatus: 0
            });
        } else {
            // Add to favourites
            const fav = new Favourites({ userId, propertyId });
            await fav.save();
            return res.status(200).json({
                status: true,
                message: "Property added to favourites",
                favouritestatus: 1
            });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// 📌 Get Favourites for logged in user
const getFavourites = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id || req.user?.userId;
        if (!userId) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }

        // Fetch favourites and populate the property details
        const favourites = await Favourites.find({ userId })
            .populate({
                path: "propertyId",
                populate: [
                    { path: "state" },
                    { path: "city" },
                    { path: "propertyType" },
                    { path: "micromarket" },
                    { path: "locality" },
                    { path: "amenities.amenityid", model: "Amenity" }
                ]
            })
            .lean(); // Returns plain JavaScript objects

        // Extract and format properties
        const favProperties = favourites
            .map(fav => {
                if (!fav.propertyId) {
                    return null;
                }

                // Use the spread operator to ensure a plain object
                const property = { ...fav.propertyId, favouritestatus: 1 };
                return formatAmenitiesWithFullUrl(req, property);
            })
            .filter(Boolean); // Remove null entries

        res.status(200).json({
            status: true,
            message: "Favourites fetched successfully",
            total: favProperties.length,
            privateOffices: favProperties.filter(fav => fav.propertyType?.name && fav.propertyType?.name.includes("Private Office")).length,
            commercial: favProperties.filter(fav => fav.propertyType?.name && fav.propertyType?.name.includes("Commercial")).length,
            featured: favProperties.filter(fav => fav.displayIn && fav.displayIn.includes("Featured")).length,
            favourites: favProperties
        });
    } catch (error) {
        console.error("Error fetching favourites:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const searchProperties = async (req, res) => {
    try {
        const { city, location, listingType, propertyAvailableFor, unitType, expectedAmount } = req.query;
        const filter = { status: "Approved" };

        // ✅ Convert city string to ObjectId(s)
        let cityIds = [];
        if (city) {
            cityIds = await City.find({ name: new RegExp(city, "i") }).distinct("_id");
            if (cityIds.length) filter.city = { $in: cityIds };
        }

        // ✅ Convert unitType string to ObjectId if provided
        if (unitType) {
            const unitTypeObj = await mongoose.model("UnitType").findOne({ name: new RegExp(unitType, "i") });
            if (unitTypeObj) filter.unitType = unitTypeObj._id;
        }

        // ✅ Location search (micromarket/locality/pinCode)
        if (location) {
            const locationRegex = new RegExp(location, "i");

            const [microIds, localityIds] = await Promise.all([
                Micromarket.find({ name: locationRegex }).distinct("_id"),
                Locality.find({ name: locationRegex }).distinct("_id"),
            ]);

            filter.$or = [
                ...(cityIds.length ? [{ city: { $in: cityIds } }] : []),
                ...(microIds.length ? [{ micromarket: { $in: microIds } }] : []),
                ...(localityIds.length ? [{ locality: { $in: localityIds } }] : []),
                { pinCode: locationRegex },
            ];
        }

        // ✅ Other optional filters
        if (listingType) filter.listingType = listingType;
        if (propertyAvailableFor) filter.propertyAvailableFor = propertyAvailableFor;

        if (expectedAmount) {
            if (expectedAmount.includes("-")) {
                const [min, max] = expectedAmount.split("-").map(Number);
                filter.expectedAmount = { $gte: min, $lte: max };
            } else {
                filter.expectedAmount = Number(expectedAmount);
            }
        }

        // ✅ Exclude properties created by the current user (optional)
        const userId = req.user?._id;
        if (userId) filter.createdBy = { $ne: mongoose.Types.ObjectId(userId) };

        // ✅ Fetch properties with safe populates
        let properties = await Property.find(filter)
            .populate("state city micromarket locality propertyType unitType", null, null, { strictPopulate: false })
            .populate("amenities.amenityid", null, null, { strictPopulate: false })
            .populate("createdBy", null, null, { strictPopulate: false })
            .lean();

        // ✅ Format amenities URLs
        properties = properties.map((p) => formatAmenitiesWithFullUrl(req, p));

        // ✅ Add favourite & compare status
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            // Fetch favorites and compare lists in parallel
            const [favs, compares] = await Promise.all([
                Favourites.find({ userId }).select("propertyId").lean(),
                Compare.find({ userId }).select("propertyId").lean(),
            ]);

            const favIds = new Set(favs.map(f => f.propertyId.toString()));
            const compareIds = new Set(compares.map(c => c.propertyId.toString()));

            properties = properties.map(p => ({
                ...p,
                favouritestatus: favIds.has(p._id.toString()) ? 1 : 0,
                compareStatus: compareIds.has(p._id.toString()) ? 1 : 0,
            }));
        } else {
            // Default status for unauthenticated users
            properties = properties.map(p => ({
                ...p,
                favouritestatus: 0,
                compareStatus: 0,
            }));
        }

        if (!properties.length) {
            return res.status(200).json({
                status: true,
                message: "No properties found for this search criteria",
                properties: [],
            });
        }

        res.json({
            status: true,
            message: "Properties fetched successfully",
            properties,
        });
    } catch (error) {
        console.error("Error searching properties:", error);
        res.status(500).json({
            status: false,
            message: "Failed to search by filters. Please check query params.",
            error: error.message,
        });
    }
};


const getSimilarProperties = async (req, res) => {
    try {
        const { id } = req.params;
        const baseProperty = await Property.findById(id);

        if (!baseProperty) {
            return res.status(404).json({ status: false, message: "Property not found" });
        }

        const filter = {
            _id: { $ne: baseProperty._id },
            status: "Approved",
            propertyType: baseProperty.propertyType,
            city: baseProperty.city,
            listingType: baseProperty.listingType
        };

        let similarProperties = await Property.find(filter)
            .populate("state city propertyType micromarket locality")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity"
            })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(); // Returns plain JavaScript objects

        // Format amenities with full URL
        similarProperties = similarProperties.map(p => formatAmenitiesWithFullUrl(req, p));

        // Inject favorite and compare status
        const userId = req.user?._id || req.user?.id || req.user?.userId;

        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            // Fetch favorites and compare lists in parallel
            const [favs, compares] = await Promise.all([
                Favourites.find({ userId }).select("propertyId").lean(),
                Compare.find({ userId }).select("propertyId").lean(),
            ]);

            const favIds = new Set(favs.map(f => f.propertyId.toString()));
            const compareIds = new Set(compares.map(c => c.propertyId.toString()));

            similarProperties = similarProperties.map(p => ({
                ...p,
                favouritestatus: favIds.has(p._id.toString()) ? 1 : 0,
                compareStatus: compareIds.has(p._id.toString()) ? 1 : 0,
            }));
        } else {
            // Default status for unauthenticated users
            similarProperties = similarProperties.map(p => ({
                ...p,
                favouritestatus: 0,
                compareStatus: 0,
            }));
        }

        res.status(200).json({
            status: true,
            message: "Similar properties fetched successfully",
            count: similarProperties.length,
            properties: similarProperties
        });
    } catch (error) {
        console.error("Error fetching similar properties:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const getTopCitiesByPropertyType = async (req, res) => {
    try {
        const { propertyTypeId } = req.params;
        let matchStage = { status: "Approved" };

        if (propertyTypeId !== "all") {
            if (!mongoose.Types.ObjectId.isValid(propertyTypeId)) {
                return res.status(400).json({ status: false, message: "Invalid PropertyType ID" });
            }
            matchStage.propertyType = new mongoose.Types.ObjectId(propertyTypeId);
        }

        const topCities = await Property.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$city",
                    propertyCount: { $sum: 1 },
                    sampleSlug: { $first: "$PropertyCitySlug" }
                }
            },
            {
                $lookup: {
                    from: "cities",
                    localField: "_id",
                    foreignField: "_id",
                    as: "cityDetails"
                }
            },
            { $unwind: "$cityDetails" },
            { $sort: { propertyCount: -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: 0,
                    cityId: "$cityDetails._id",
                    citySlug: "$sampleSlug",
                    cityName: "$cityDetails.name",
                    cityImage: { $ifNull: ["$cityDetails.image", null] },
                    propertyCount: 1
                }
            }
        ]);

        const citiesWithFullPath = topCities.map(city => ({
            ...city,
            cityImage: city.cityImage ? `${process.env.BACKEND_URL}${city.cityImage}` : null
        }));

        res.status(200).json({
            status: true,
            message: propertyTypeId === "all"
                ? "Top cities (all property types) fetched successfully"
                : "Top cities fetched successfully",
            topCities: citiesWithFullPath
        });
    } catch (error) {
        console.error("Error in getTopCitiesByPropertyType:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};


const toggleCompareProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user?._id || req.user?.id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Check if already compared
        const existingCompare = await Compare.findOne({ userId, propertyId });

        if (existingCompare) {
            // remove from compare
            await Compare.deleteOne({ _id: existingCompare._id });
            return res.status(200).json({
                message: "Property removed from compare list",
                compareStatus: 0
            });
        } else {
            // add to compare
            await Compare.create({ userId, propertyId });
            return res.status(200).json({
                message: "Property added to compare list",
                compareStatus: 1
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getCompareProperties = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized: User not authenticated",
                properties: []
            });
        }

        // Fetch the properties that the user has added to their compare list
        const compares = await Compare.find({ userId }).select("propertyId").lean();

        if (!compares.length) {
            return res.status(200).json({
                status: true,
                message: "No properties found in the compare list",
                properties: []
            });
        }

        const compareIds = compares.map(c => c.propertyId);

        // Fetch only the properties that are in the compare list
        const properties = await Property.find({ _id: { $in: compareIds } })
            .populate("city state propertyType micromarket locality")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity"
            })
            .sort({ createdAt: -1 })
            .lean();

        // Fetch favorites for the user
        const favs = await Favourites.find({ userId }).select("propertyId").lean();
        const favIds = new Set(favs.map(f => f.propertyId.toString()));

        // Format amenities and inject favourite status
        const finalProperties = properties.map(p => {
            const obj = formatAmenitiesWithFullUrl(req, p);
            obj.favouritestatus = favIds.has(p._id.toString()) ? 1 : 0;
            obj.compareStatus = 1; // Since these properties are already in the compare list
            return obj;
        });

        res.status(200).json({
            status: true,
            message: "Compare properties fetched successfully",
            properties: finalProperties
        });
    } catch (error) {
        console.error("Error fetching compare properties:", error);
        res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
};

module.exports = {
    addProperty,
    editProperty,
    toggleFavourite,
    getFavourites,
    changeStatus,
    getstatusProperties,
    getAllPropertiesfilter,
    getPropertiesByCategory,
    getPropertiesByUser,
    getAllProperties,
    getPropertyById,
    getPropertiesByCitySlug,
    getPropertiesByMicromarketSlug,
    getPropertyBySlug,
    deleteProperty,
    deleteAvailableOption,
    deletePropertyMedia,
    searchProperties,
    getSimilarProperties,
    getTopCitiesByPropertyType,
    toggleCompareProperty,
    getCompareProperties
};
