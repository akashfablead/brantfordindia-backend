const mongoose = require("mongoose");



const connectivitySchema = new mongoose.Schema({
    mode: { type: String },
    approxDistance: { type: String }
}, { _id: true });

const meetingRoomSchema = new mongoose.Schema({
    noOfRooms: { type: Number },
    capacityPerRoom: { type: Number }
}, { _id: true });

const availableOptionSchema = new mongoose.Schema({
    option: { type: String },
    pricing: { type: String }
}, { _id: true });

const amenitiesSchema = new mongoose.Schema({
    amenityid: { type: mongoose.Schema.Types.ObjectId, ref: "Amenity", required: true },
}, { _id: false });

const unitTypeSchema = new mongoose.Schema({
    unitTypeid: { type: mongoose.Schema.Types.ObjectId, ref: "UnitType" },
}, { _id: false });

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    PropertyCitySlug: { type: String, unique: true, required: true },
    PropertyMicromarketSlug: { type: String, unique: true, required: true },
    listingPropertyAs: { type: String, enum: ["Owner", "Broker", "Agent", "Channel Partner"], required: true },
    propertyAvailableFor: { type: String, enum: ["Both", "Rent", "Sale"], required: true },
    listingType: { type: String, enum: ["Residential", "Commercial", "Coworking", "Plots"], required: true },

    state: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    buildingName: { type: String, required: true },
    buildingStatus: { type: String, enum: ["Ready", "Under Construction"], required: true },
    proposedAvailabilityDate: { type: Date },
    displayIn: [{ type: String, enum: ["Recently Added", "Featured", "Recently Transacted"] }],
    propertyType: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyType", required: true },
    micromarket: { type: mongoose.Schema.Types.ObjectId, ref: "Micromarket", required: true },
    locality: { type: mongoose.Schema.Types.ObjectId, ref: "Locality", required: true },

    address: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    unitType: { type: mongoose.Schema.Types.ObjectId, ref: "UnitType" },
    pinCode: { type: String },

    connectivity: [connectivitySchema],

    // Commercial fields
    inventoryCondition: { type: String },
    unitNo: { type: String },
    floorNo: { type: String },
    expectedAmount: { type: String },
    quotedAmountPerSqft: { type: String },
    unitDescription: { type: String },

    // Residential fields
    unitCondition: { type: String },
    residentialUnitTypes: [unitTypeSchema],
    chargeableArea: { type: String },

    // Coworking fields
    availableCapacity: { type: String },
    totalArea: { type: String },
    configuration: { type: String },
    quotedAmountPerSeat: { type: String },
    offering: { type: String },
    meetingRoomsAvailable: { type: String, enum: ["Yes", "No"] },
    meetingRoomDetails: [meetingRoomSchema],

    amenities: [amenitiesSchema],
    openToBrokers: { type: String, enum: ["Yes", "No"] },
    openToNegotiation: { type: String, enum: ["Yes", "No"] },
    minimumLockInMonths: { type: Number },
    minimumLicenseMonths: { type: Number },
    description: { type: String, required: true },

    floorPlans: [{ type: String }],
    propertyImages: [{ type: String }],
    featuredImages: [{ type: String }],
    videoUrl: { type: String },

    availableOptions: [availableOptionSchema],

    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);
