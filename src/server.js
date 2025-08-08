// src/server.js
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const app = require("./app");
const connectDB = require("./config/db");
const express = require("express");

connectDB();
app.use(cors(
    {
        origin: "*"
    }
));

// Load environment variables
app.use("/uploads/profiles", express.static(path.join(__dirname, "uploads/profiles")));
app.use("/uploads/cities", express.static(path.join(__dirname, "uploads/cities")));
app.use("/uploads/amenities", express.static(path.join(__dirname, "uploads/amenities")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
