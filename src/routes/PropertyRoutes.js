const express = require("express");
const router = express.Router();
const { addProperty, editProperty, changeStatus, getApprovedProperties, getAllProperties, getPropertyById, getPropertyBySlug, deleteProperty, deleteAvailableOption, deleteMeetingRoom, deleteConnectivity, getAllPropertiesfilter, getRecentlyAddedOfficeSpaces, toggleFavourite, getFavouriteProperties } = require("../controllers/propertyController");
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
router.post("/favourites/toggle", authenticateToken, upload.none(), toggleFavourite);
router.get("/favourites", authenticateToken, getFavouriteProperties);

router.post("/status/:id", authenticateToken, upload.none(), changeStatus);
router.get("/approved", optionalAuth, getApprovedProperties);

// all get & Filter routes 
router.get("/", optionalAuth, getAllPropertiesfilter);
router.get("/recently-added-office-spaces", optionalAuth, getRecentlyAddedOfficeSpaces);

// all property in admin
router.get("/all", getAllProperties);

router.get("/:id", getPropertyById);
router.get("/slug/:slug", getPropertyBySlug);
router.delete("/:id", authenticateToken, deleteProperty);

// Sub-item deletes
router.delete("/available-option/:id/:optionId", authenticateToken, deleteAvailableOption);
router.delete("/meeting-room/:id/:roomId", authenticateToken, deleteMeetingRoom);
router.delete("/connectivity/:id/:connectId", authenticateToken, deleteConnectivity);

module.exports = router;
