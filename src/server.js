// src/server.js
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const app = require("./app");
const connectDB = require("./config/db");
const express = require("express");

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load environment variables
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server running at http://localhost:${PORT}  .`);
// });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
});