const mongoose = require("mongoose");


const availableOptionSchema = new mongoose.Schema({
    option: { type: String },
}, { _id: true });

const amenitiesSchema = new mongoose.Schema({
    amenityid: { type: mongoose.Schema.Types.ObjectId, ref: "Amenity", required: true },
}, { _id: false });


const propertySchema = new mongoose.Schema({

    // Basic Info step - 1
    listingPropertyAs: { type: String, enum: ["Owner", "Broker", "Agent", "Builder"], required: true },
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    PropertyCitySlug: { type: String, unique: true, required: true },
    PropertyMicromarketSlug: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    listingType: { type: String, enum: ["Residential", "Commercial", "Coworking", "Plots"], required: true },
    unitType: { type: mongoose.Schema.Types.ObjectId, ref: "UnitType" },
    propertyAvailableFor: { type: String, enum: ["Both", "Rent", "Sale"], required: true },
    statusoftheproperty: { type: String, enum: ["Occupied", "Vacant"], required: true }, // Add new
    buildingStatus: { type: String, enum: ["Immediately", "After today"], required: true },
    proposedAvailabilityDate: { type: Date },

    // Gallery step - 2
    propertyImages: [{ type: String, required: true }],
    featuredImages: [{ type: String }],
    propertyVideos: [{ type: String }], // Add new
    videoUrl: { type: String },

    // Location Details step - 3
    address: { type: String, required: true },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    locality: { type: mongoose.Schema.Types.ObjectId, ref: "Locality", required: true },
    buildingName: { type: String, required: true },
    wingtower: { type: String }, // Add new
    floorNo: { type: String },
    totalfloors: { type: String }, // Add new
    unitNo: { type: String },
    pinCode: { type: String },
    micromarket: { type: mongoose.Schema.Types.ObjectId, ref: "Micromarket", required: true },
    yearofconstruction: { type: String }, // Add new
    landmark: { type: String }, // Add new
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },

    // Specifications  step - 4
    // only show Commercial and Residential 
    areatype: { type: String }, // Add new

    // only all in show 
    totalArea: { type: String }, // Add new

    // only show Commercial in Category Coworking then show this
    availableCapacity: { type: String },
    flexiopendesks: { type: String },// Add new
    dedicateddesks: { type: String },// Add new
    managedcabinsofcapacity: { type: String },// Add new
    meetingroomofcapacity: { type: String },// Add new
    conferenceroomcapacity: { type: String },// Add new

    // only show Plots 
    dimensions: { type: String },// Add new
    availableOptions: [availableOptionSchema],
    floorsallowed: { type: String },// Add new
    ownership: { type: String },// Add new
    roadwidth: { type: String },// Add new

    // Pricing Details step - 5
    openToNegotiation: { type: String, enum: ["Yes", "No"] },
    ratepersqft: { type: String },
    preleased: { type: String, enum: ["Yes", "No"] },

    // slected in Rent
    rent: { type: String },// Add new
    Deposit: { type: String },// Add new
    minlockinperiodmonths: { type: String },// Add new
    modificationofinteriors: { type: String },// Add new , enum: ["Yes", "No"] 

    // slected in Sale
    expectedprice: { type: String },// Add new

    // Amenities Details   step - 6
    amenities: [amenitiesSchema],

    // Additional Details   step - 7
    unitcondition: { type: String, enum: ["Bareshell", "Warmshell", "Semi Furnished", "Fully Furnished", "As Is"] },// Add new
    washrooms: { type: String },// Add new
    pantrycafeteria: { type: String, enum: ["Yes", "No"] }, // Add new
    maintenancecharges: { type: String }, // Add new
    maintenanceperiod: { type: String, enum: ["Monthly", "Quarterly", "One Time", "Per Sqft Monthly"] }, // Add new
    dedicatedcarparking: { type: String, enum: ["Yes", "No"] }, // Add new
    dedicatedbikeparking: { type: String }, // Add new
    openToBrokers: { type: String, enum: ["Yes", "No"] },
    displayIn: [{ type: String, enum: ["Recently Added", "Featured", "Recently Transacted"] }],
    propertyType: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyType", required: true },

    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);
