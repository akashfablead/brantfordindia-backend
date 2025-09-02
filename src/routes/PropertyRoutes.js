const express = require("express");
const router = express.Router();
const { addProperty, editProperty, changeStatus, getAllProperties, getPropertyById, getPropertyBySlug, deleteProperty, deleteAvailableOption, deleteMeetingRoom, deleteConnectivity, getAllPropertiesfilter, getRecentlyAddedOfficeSpaces, toggleFavourite, getFavourites, getstatusProperties, getPropertiesByCitySlug, getPropertiesByMicromarketSlug, searchProperties, getSimilarProperties, getTopCitiesByPropertyType, toggleCompareProperty, getCompareProperties, getPropertiesByUser, getPropertiesByCategory, deletePropertyMedia, getAllPropertiesAdmin } = require("../controllers/propertyController");
const { authenticateToken } = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");
const createMulterUpload = require("../config/multer");
const upload = createMulterUpload("properties");

// Sub-item deletes
const propertyUploads = upload.fields([
    { name: "floorPlans", maxCount: 50 },
    { name: "propertyImages", maxCount: 50 },
    { name: "featuredImages", maxCount: 50 },
    { name: "propertyVideos", maxCount: 10 },
]);

// Get admin properties
router.get("/all-admin-status", upload.none(), getAllPropertiesAdmin);

// CRUD routes
router.post("/", authenticateToken, propertyUploads, addProperty);
router.put("/:id", authenticateToken, propertyUploads, editProperty);
router.delete("/:id", authenticateToken, deleteProperty);

// Sub-item deletes
router.delete("/available-option/:id/:optionId", authenticateToken, deleteAvailableOption);
router.delete("/media/:id", authenticateToken, upload.none(), deletePropertyMedia);


// Get favorite properties user
// Toggle favorite (add/remove)
router.post("/favourites/toggle", authenticateToken, upload.none(), toggleFavourite);
// Get all favorites
router.get("/favourites", authenticateToken, getFavourites);

// Compare Property
router.post("/compare/:propertyId", authenticateToken, upload.none(), toggleCompareProperty);
// Get compare properties
router.get("/compare", authenticateToken, getCompareProperties);

router.post("/status/:id", authenticateToken, upload.none(), changeStatus);
router.get("/status", optionalAuth, getstatusProperties);
router.get("/slug/:slug", optionalAuth, getPropertyBySlug);
router.get("/city/:slug", optionalAuth, getPropertiesByCitySlug);
router.get("/micromarket-slug/:slug", optionalAuth, getPropertiesByMicromarketSlug);

// all get & Filter routes 
router.get("/", optionalAuth, getAllPropertiesfilter);
router.get("/homecategory", optionalAuth, getPropertiesByCategory);
router.get("/search", optionalAuth, searchProperties);

// Get properties created by the authenticated user
router.get("/my-properties", authenticateToken, getPropertiesByUser);

// all property in fronted
router.get("/all", optionalAuth, getAllProperties);
router.get("/:id", optionalAuth, getPropertyById);
router.get("/similar/:id", optionalAuth, getSimilarProperties);
router.get("/top-cities/:propertyTypeId", getTopCitiesByPropertyType);



module.exports = router;
