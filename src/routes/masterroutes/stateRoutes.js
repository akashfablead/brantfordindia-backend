const express = require("express");
const router = express.Router();
const { addState, editState, getStates, getStateswithouttoken, deleteState } = require("../../controllers/mastercontrollers/stateController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const createMulterUpload = require("../../config/multer");
const upload = createMulterUpload("");

router.post("/", authenticateToken, upload.none(), addState);
router.put("/:id", authenticateToken, upload.none(), editState);
router.delete("/:id", authenticateToken, upload.none(), deleteState);
router.get("/", authenticateToken, upload.none(), getStates);
router.get("/all", upload.none(), getStateswithouttoken);

module.exports = router;
