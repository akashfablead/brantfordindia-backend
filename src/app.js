// src/app.js
const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const stateRoutes = require("./routes/masterroutes/stateRoutes");
const cityRoutes = require("./routes/masterroutes/cityRoutes");
const micromarketRoutes = require("./routes/masterroutes/micromarketRoutes");
const localityRoutes = require("./routes/masterroutes/localityRoutes");
const amenityRoutes = require("./routes/masterroutes/amenityRoutes");
const propertyTypeRoutes = require("./routes/masterroutes/propertyTypeRoutes");
const unitTypeRoutes = require("./routes/masterroutes/unitTypeRoutes");
const blogCategoryRoutes = require("./routes/masterroutes/blogCategoryRoutes");
const blogTagRoutes = require("./routes/masterroutes/blogTagRoutes");
const jobCategoryRoutes = require("./routes/masterroutes/jobCategoryRoutes");
const roleRoutes = require("./routes/masterroutes/roleRoutes");
const userRoutes = require("./routes/masterroutes/userRoutes");
const adminuserRoutes = require("./routes/masterroutes/adminuserRoutes");
const contactUsRoutes = require("./routes/masterroutes/contactUsRoutes");
const termsRoutes = require("./routes/masterroutes/termsRoutes");
const logoRoutes = require("./routes/masterroutes/logoRoutes");
const clientSliderRoutes = require("./routes/masterroutes/clientSliderRoutes");
const faqRoutes = require("./routes/faqRoutes");
const blogRoutes = require("./routes/blogRoutes");
const advertiseRoutes = require("./routes/advertiseRoutes");
const jobpostsRoutes = require("./routes/jobpostsRoutes");

app.use("/api/auth", authRoutes);

// Master admin routes
app.use("/api/states", stateRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/micromarkets", micromarketRoutes);
app.use("/api/localities", localityRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/propertytypes", propertyTypeRoutes);
app.use("/api/unittypes", unitTypeRoutes);
app.use("/api/blogcategories", blogCategoryRoutes);
app.use("/api/blogtags", blogTagRoutes);
app.use("/api/jobcategories", jobCategoryRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/adminusers", adminuserRoutes);
app.use("/api/contactus", contactUsRoutes);
app.use("/api/terms", termsRoutes);
app.use("/api/logo", logoRoutes);
app.use("/api/clientsliders", clientSliderRoutes);

// FAQ page routes
app.use("/api/faq", faqRoutes);

// blog page 
app.use("/api/blog", blogRoutes);

// Advertise routes
app.use("/api/advertises", advertiseRoutes);

// Job Post routes
app.use("/api/jobposts", jobpostsRoutes);

// fake route for testing
app.get("/", (req, res) => res.send("Hello World!"));


module.exports = app;
