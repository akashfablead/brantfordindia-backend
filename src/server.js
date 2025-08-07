// src/server.js
require("dotenv").config();
const path = require("path");
const app = require("./app");
const connectDB = require("./config/db");
const express = require("express");

connectDB();
// Load environment variables
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
