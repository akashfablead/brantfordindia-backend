// src/routes/contactUsRoutes.js
const express = require("express");
const { addContact, editContact, getContact, deleteContact } = require("../../controllers/mastercontrollers/contactUsController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");
const router = express.Router();


// router.post("/", authenticateToken, upload.none(), addContact);
router.put("/", authenticateToken, upload.none(), editContact);
router.get("/", getContact);
router.delete("/", authenticateToken, upload.none(), deleteContact);

module.exports = router;
