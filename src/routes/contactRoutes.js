const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const createMulterUpload = require("../config/multer");
const { getContacts, getContactById, addContact, updateContact, deleteContact, uploadContacts } = require("../controllers/contactController");
const upload = createMulterUpload("uploads/contacts/");


// Routes
router.get("/", authenticateToken, getContacts);
router.get("/:id", getContactById);
router.post("/", authenticateToken, upload.none(), addContact);
router.post("/upload", upload.single("file"), uploadContacts);
router.put("/:id", authenticateToken, upload.none(), updateContact);
router.delete("/:id", authenticateToken, deleteContact);

module.exports = router;
