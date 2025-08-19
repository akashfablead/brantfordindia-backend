const express = require("express");
const router = express.Router();
const { addProperty, editProperty, changeStatus, getAllProperties, getPropertyById, getPropertyBySlug, deleteProperty, deleteAvailableOption, deleteMeetingRoom, deleteConnectivity, getAllPropertiesfilter, getRecentlyAddedOfficeSpaces, toggleFavourite, getFavourites, getstatusProperties, getPropertiesByCitySlug, getPropertiesByMicromarketSlug, searchProperties, getSimilarProperties } = require("../controllers/propertyController");
const { authenticateToken } = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");
const createMulterUpload = require("../config/multer");
const upload = createMulterUpload("properties");

// Sub-item deletes
const propertyUploads = upload.fields([
    { name: "floorPlans", maxCount: 10 },
    { name: "propertyImages", maxCount: 20 },
    { name: "featuredImages", maxCount: 5 }
]);

// CRUD routes
router.post("/", authenticateToken, propertyUploads, addProperty);
router.put("/:id", authenticateToken, propertyUploads, editProperty);
router.delete("/:id", authenticateToken, deleteProperty);
// Sub-item deletes
router.delete("/available-option/:id/:optionId", authenticateToken, deleteAvailableOption);
router.delete("/meeting-room/:id/:roomId", authenticateToken, deleteMeetingRoom);
router.delete("/connectivity/:id/:connectId", authenticateToken, deleteConnectivity);


// Get favorite properties user
// Toggle favorite (add/remove)
router.post("/favourites/toggle", authenticateToken, upload.none(), toggleFavourite);
// Get all favorites
router.get("/favourites", authenticateToken, getFavourites);

router.post("/status/:id", authenticateToken, upload.none(), changeStatus);
router.get("/status", optionalAuth, getstatusProperties);
router.get("/slug/:slug", optionalAuth, getPropertyBySlug);
router.get("/city/:slug", optionalAuth, getPropertiesByCitySlug);
router.get("/micromarket-slug/:slug", optionalAuth, getPropertiesByMicromarketSlug);

// all get & Filter routes 
router.get("/", optionalAuth, getAllPropertiesfilter);
router.get("/recently-added-office-spaces", optionalAuth, getRecentlyAddedOfficeSpaces);
router.get("/search", optionalAuth, searchProperties);

// all property in fronted
router.get("/all", getAllProperties);
router.get("/:id", getPropertyById);
router.get("/similar/:id", getSimilarProperties);

module.exports = router;
