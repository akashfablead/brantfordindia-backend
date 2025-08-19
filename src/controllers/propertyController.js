const slugify = require("slugify");
const Property = require("../models/Property");
const { default: mongoose } = require("mongoose");
const PropertyType = require("../models/Master/PropertyType");
const City = require("../models/Master/City");
const Micromarket = require("../models/Master/Micromarket");
const Locality = require("../models/Master/Locality");

// 📌 Helper to build full URL
// const getFullUrl = (req, filePath) => {
//     if (!filePath) return "";
//     return `${req.protocol}://${req.get("host")}/${filePath.replace(/\\/g, "/")}`;
// };


const getFullUrl = (req, relativePath) => {
    if (!relativePath) return null;
    // Remove any starting slash to avoid "//" in final URL
    const cleanPath = relativePath.replace(/^\/+/, "");
    return `${req.protocol}://${req.get("host")}/${cleanPath}`;
};


// 📌 Convert amenities image to full URL
const formatAmenitiesWithFullUrl = (req, property) => {
    const formatted = property.toObject();

    // Format amenities images
    if (formatted.amenities && Array.isArray(formatted.amenities)) {
        formatted.amenities = formatted.amenities.map(a => {
            if (a.amenityid && a.amenityid.image) {
                a.amenityid.image = getFullUrl(req, a.amenityid.image);
            }
            return a;
        });
    }

    // Format city image (single object case)
    if (formatted.city && formatted.city.image) {
        formatted.city.image = getFullUrl(req, formatted.city.image);
    }

    // If city is an array (just in case some APIs return it that way)
    if (Array.isArray(formatted.city)) {
        formatted.city = formatted.city.map(c => {
            if (c.image) {
                c.image = getFullUrl(req, c.image);
            }
            return c;
        });
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
            title, listingPropertyAs, propertyAvailableFor, listingType,
            state, city, buildingName, buildingStatus, proposedAvailabilityDate,
            displayIn, propertyType, micromarket, locality, address,
            latitude, longitude, pinCode,
            inventoryCondition, unitNo, floorNo, unitType, expectedAmount,
            quotedAmountPerSqft, unitDescription, unitCondition,
            chargeableArea, availableCapacity,
            totalArea, configuration, quotedAmountPerSeat, offering,
            meetingRoomsAvailable,
            openToBrokers, openToNegotiation, minimumLockInMonths,
            minimumLicenseMonths, description, videoUrl
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
        const connectivityArr = parseArrayFields(req.body, ["mode[]", "approxDistance[]"]);
        const meetingRoomsArr = parseArrayFields(req.body, ["noOfRooms[]", "capacityPerRoom[]"]);
        const availableOptionsArr = parseArrayFields(req.body, ["option[]", "pricing[]"]);
        const amenitiesArray = parseArrayFields(req.body, ["amenityid[]"]);
        const residentialUnitArr = parseArrayFields(req.body, ["unitTypeid[]"]);

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
            latitude,
            longitude,
            pinCode,
            connectivity: connectivityArr,
            inventoryCondition,
            unitNo,
            floorNo,
            unitType,
            expectedAmount,
            quotedAmountPerSqft,
            unitDescription,
            unitCondition,
            residentialUnitTypes: residentialUnitArr,
            chargeableArea,
            availableCapacity,
            totalArea,
            configuration,
            quotedAmountPerSeat,
            offering,
            meetingRoomsAvailable,
            meetingRoomDetails: meetingRoomsArr,
            amenities: amenitiesArray,
            openToBrokers,
            openToNegotiation,
            minimumLockInMonths,
            minimumLicenseMonths,
            description,
            floorPlans: req.files["floorPlans"]?.map(f => getFullUrl(req, f.path)) || [],
            propertyImages: req.files["propertyImages"]?.map(f => getFullUrl(req, f.path)) || [],
            featuredImages: req.files["featuredImages"]?.map(f => getFullUrl(req, f.path)) || [],
            videoUrl,
            availableOptions: availableOptionsArr,
            createdBy: req.user?._id || req.user?.id || req.user?.userId
        });

        // Save the property
        const savedProperty = await newProperty.save();
        const populatedProperty = await Property.findById(savedProperty._id)
            .populate("state city propertyType micromarket locality");

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

        const connectivityArr = parseArrayFields(req.body, ["mode[]", "approxDistance[]"]);
        const meetingRoomsArr = parseArrayFields(req.body, ["noOfRooms[]", "capacityPerRoom[]"]);
        const availableOptionsArr = parseArrayFields(req.body, ["option[]", "pricing[]"]);
        const amenitiesArray = parseArrayFields(req.body, ["amenityid[]"]);
        const residentialUnitArr = parseArrayFields(req.body, ["unitTypeid[]"]);

        const updatedData = {
            ...req.body,
            connectivity: connectivityArr,
            meetingRoomDetails: meetingRoomsArr,
            availableOptions: availableOptionsArr,
            amenities: amenitiesArray,
            residentialUnitTypes: residentialUnitArr
        };

        // Append files if new ones uploaded
        if (req.files["floorPlans"]) {
            updatedData.floorPlans = req.files["floorPlans"].map(f => getFullUrl(req, f.path));
        }
        if (req.files["propertyImages"]) {
            updatedData.propertyImages = req.files["propertyImages"].map(f => getFullUrl(req, f.path));
        }
        if (req.files["featuredImages"]) {
            updatedData.featuredImages = req.files["featuredImages"].map(f => getFullUrl(req, f.path));
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


// 📌 Get All Properties for admin
const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find()
            .populate("state city propertyType micromarket locality")
            .populate("residentialUnitTypes.unitTypeid")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity"
            });

        res.json({ status: true, message: "Properties fetched successfully", properties });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};



const getRecentlyAddedOfficeSpaces = async (req, res) => {
    try {
        const filter = {
            listingType: "Coworking", // "Office Spaces"
            status: "Approved"
        };

        // If logged in → exclude own properties
        const userId = req.user?._id || req.user?.id || req.user?.userId;
        if (userId) {
            filter.createdBy = { $ne: new mongoose.Types.ObjectId(userId) };
        }

        const properties = await Property.find(filter)
            .populate("state city propertyType micromarket locality")
            .populate("residentialUnitTypes.unitTypeid")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity"
            })
            .sort({ createdAt: -1 }) // newest first
            .limit(10); // limit to 10 results

        res.json({
            status: true,
            message: "Recently Added Office Spaces fetched successfully",
            properties
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// 📌 Get status Properties
const getstatusProperties = async (req, res) => {
    try {
        const filter = {};

        // ✅ Apply status filter if provided, else default to Approved
        if (req.query.status) {
            filter.status = req.query.status;
        } else {
            filter.status = "Approved";
        }

        // ✅ Exclude properties created by the current user
        const userId = req.user?._id || req.user?.id || req.user?.userId;
        if (userId) {
            filter.createdBy = { $ne: new mongoose.Types.ObjectId(userId) };
        }

        const properties = await Property.find(filter)
            .populate("state city propertyType micromarket locality")
            .populate("residentialUnitTypes.unitTypeid")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity"
            });

        res.json({
            status: true,
            message: "Properties fetched successfully",
            properties: properties || []
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// 📌 Get All Properties 
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
            .populate("residentialUnitTypes.unitTypeid")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity"
            })
            .sort(sort);

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
            .populate("residentialUnitTypes.unitTypeid")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity"
            });

        if (!property) return res.status(404).json({ status: false, message: "Property not found" });

        property = formatAmenitiesWithFullUrl(req, property);

        res.json({ status: true, message: "Property fetched successfully", property });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// 📌 Get Property by Slug (only Approved)
const getPropertyBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        let property = await Property.findOne({ slug, status: "Approved" }) // ✅ Only approved
            .populate("state city propertyType micromarket locality")
            .populate("residentialUnitTypes.unitTypeid")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity"
            });

        if (!property) {
            return res.status(404).json({
                status: false,
                message: "Property not found or not approved"
            });
        }

        property = formatAmenitiesWithFullUrl(req, property);

        res.json({
            status: true,
            message: "Property fetched successfully",
            property
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// 📌 Get properties by PropertyCitySlug
const getPropertiesByCitySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                status: false,
                message: "City slug is required",
            });
        }

        const filter = {
            PropertyCitySlug: slug,
            status: "Approved", // Only approved listings
        };

        // Exclude current user's own listings if logged in
        const userId = req.user?._id || req.user?.id || req.user?.userId;
        if (userId) {
            filter.createdBy = { $ne: new mongoose.Types.ObjectId(userId) };
        }

        let properties = await Property.find(filter)
            .populate("state city propertyType micromarket locality")
            .populate("residentialUnitTypes.unitTypeid")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity",
            });

        // Format amenities & images to full URL
        properties = properties.map(p => formatAmenitiesWithFullUrl(req, p));

        if (!properties.length) {
            return res.status(200).json({
                status: true,
                message: "No properties found for this city slug",
            });
        }

        res.status(200).json({
            status: true,
            message: "Properties fetched successfully",
            properties,
        });
    } catch (error) {
        console.error("Error in getPropertiesByCitySlug:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

// 📌 Get properties by PropertyMicromarketSlug
const getPropertiesByMicromarketSlug = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                status: false,
                message: "Micromarket slug is required",
            });
        }

        const filter = {
            PropertyMicromarketSlug: slug,
            status: "Approved", // ✅ Only approved listings
        };

        // Exclude current user's own listings if logged in
        const userId = req.user?._id || req.user?.id || req.user?.userId;
        if (userId) {
            filter.createdBy = { $ne: new mongoose.Types.ObjectId(userId) };
        }

        let properties = await Property.find(filter)
            .populate("state city propertyType micromarket locality")
            .populate("residentialUnitTypes.unitTypeid")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity",
            });

        // Format amenities & images to full URL
        properties = properties.map(p => formatAmenitiesWithFullUrl(req, p));

        if (!properties.length) {
            return res.status(200).json({
                status: true,
                message: "No properties found for this micromarket slug",
            });
        }

        res.status(200).json({
            status: true,
            message: "Properties fetched successfully",
            properties,
        });
    } catch (error) {
        console.error("Error in getPropertiesByMicromarketSlug:", error);
        res.status(500).json({ status: false, message: error.message });
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

// 📌 Delete Meeting Room
const deleteMeetingRoom = async (req, res) => {
    try {
        const { id, roomId } = req.params;
        const property = await Property.findById(id);
        if (!property) return res.status(404).json({ status: false, message: "Property not found" });

        property.meetingRoomDetails = property.meetingRoomDetails.filter(room => room._id.toString() !== roomId);
        await property.save();

        res.json({ status: true, message: "Meeting room deleted successfully", property });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// 📌 Delete Connectivity 
const deleteConnectivity = async (req, res) => {
    try {
        const { id, connectId } = req.params;
        const property = await Property.findById(id);
        if (!property) return res.status(404).json({ status: false, message: "Property not found" });

        property.connectivity = property.connectivity.filter(conn => conn._id.toString() !== connectId);
        await property.save();

        res.json({ status: true, message: "Connectivity deleted successfully", property });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const toggleFavourite = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const userId = req.user?._id || req.user?.id || req.user?.userId;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({
                status: false,
                message: "Property not found.",
            });
        }

        // Toggle the favourite status
        property.favouritestatus = property.favouritestatus === 1 ? 0 : 1;
        await property.save();

        const message = property.favouritestatus === 1
            ? "Property added to favorites."
            : "Property removed from favorites.";

        res.status(200).json({
            status: true,
            message,
            property,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


const getFavourites = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id || req.user?.userId;

        // Fetch all properties where favouritestatus is 1
        const favourites = await Property.find({
            favouritestatus: 1,
        }).populate([
            { path: "state" },
            { path: "city" },
            { path: "propertyType" },
            { path: "micromarket" },
            { path: "locality" },
            { path: "amenities.amenityid", model: "Amenity" },
        ]);

        res.status(200).json({
            status: true,
            message: "Favorites fetched successfully.",
            favourites,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const searchProperties = async (req, res) => {
    try {
        const { location, workspaceType } = req.query;
        const filter = { status: "Approved" };

        if (location) {
            const regex = new RegExp(location, "i"); // case-insensitive

            // Find matching IDs
            const [cityIds, microIds, localityIds] = await Promise.all([
                City.find({ name: regex }).distinct("_id"),
                Micromarket.find({ name: regex }).distinct("_id"),
                Locality.find({ name: regex }).distinct("_id"),
            ]);

            filter.$or = [
                { city: { $in: cityIds } },
                { micromarket: { $in: microIds } },
                { locality: { $in: localityIds } },
                { pinCode: regex },
            ];
        }

        if (workspaceType) {
            filter.propertyType = workspaceType;
        }

        // Exclude user's own properties
        const userId = req.user?._id;
        if (userId) filter.createdBy = { $ne: mongoose.Types.ObjectId(userId) };

        let properties = await Property.find(filter)
            .populate("state city micromarket locality propertyType")
            .populate("residentialUnitTypes.unitTypeid")
            .populate("amenities.amenityid");

        // Format image URLs
        properties = properties.map(p => formatAmenitiesWithFullUrl(req, p));

        if (!properties.length) {
            return res.status(200).json({
                status: true,
                message: "No properties found for this location",
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
            message: "Failed to search by location. Please check the location details.",
        });
    }
};

// 📌 Get Similar Properties
const getSimilarProperties = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the base property
        const baseProperty = await Property.findById(id);
        if (!baseProperty) {
            return res.status(404).json({ status: false, message: "Property not found" });
        }

        // Build filter for similar properties
        const filter = {
            _id: { $ne: baseProperty._id }, // exclude current property
            status: "Approved", // only approved properties
            propertyType: baseProperty.propertyType,
            city: baseProperty.city,
            listingType: baseProperty.listingType
        };

        const similarProperties = await Property.find(filter)
            .populate("state city propertyType micromarket locality")
            .populate("residentialUnitTypes.unitTypeid")
            .populate({
                path: "amenities.amenityid",
                model: "Amenity"
            })
            .limit(10); // limit to 10 similar properties

        const formattedProperties = similarProperties.map(p => formatAmenitiesWithFullUrl(req, p));

        res.status(200).json({
            status: true,
            message: "Similar properties fetched successfully",
            properties: formattedProperties
        });
    } catch (error) {
        console.error("Error fetching similar properties:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

// GET top cities by property type
const getTopCitiesByPropertyType = async (req, res) => {
    try {
        const { propertyTypeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(propertyTypeId)) {
            return res.status(400).json({ status: false, message: "Invalid PropertyType ID" });
        }

        // Aggregate properties by city
        let topCities = await Property.aggregate([
            { $match: { propertyType: new mongoose.Types.ObjectId(propertyTypeId), status: "Approved" } },
            { $group: { _id: "$city", propertyCount: { $sum: 1 } } },
            { $sort: { propertyCount: -1 } }, // sort descending
            { $limit: 10 },
            {
                $lookup: {
                    from: "cities", // MongoDB collection name for City model
                    localField: "_id",
                    foreignField: "_id",
                    as: "cityDetails"
                }
            },
            { $unwind: "$cityDetails" },
            {
                $project: {
                    _id: 0,
                    cityId: "$cityDetails._id",
                    cityName: "$cityDetails.name",
                    cityImage: "$cityDetails.image",
                    propertyCount: 1
                }
            }
        ]);

        // Add full URL to city image
        topCities = topCities.map(city => {
            if (city.cityImage) {
                const cleanPath = city.cityImage.replace(/^\/+/, "");
                city.cityImage = `${req.protocol}://${req.get("host")}/${cleanPath}`;
            }
            return city;
        });

        res.status(200).json({
            status: true,
            message: "Top cities fetched successfully",
            topCities
        });
    } catch (error) {
        console.error("Error in getTopCitiesByPropertyType:", error);
        res.status(500).json({ status: false, message: error.message });
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
    getRecentlyAddedOfficeSpaces,
    getAllProperties,
    getPropertyById,
    getPropertiesByCitySlug,
    getPropertiesByMicromarketSlug,
    getPropertyBySlug,
    deleteProperty,
    deleteAvailableOption,
    deleteMeetingRoom,
    deleteConnectivity,
    searchProperties,
    getSimilarProperties,
    getTopCitiesByPropertyType
};
