// src/app.js
const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
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
const testimonialRoutes = require("./routes/testimonialRoutes");
const footerLinksRoutes = require("./routes/footerLinksRoutes");
const footerLinksMicroMarketRoutes = require("./routes/footerLinksMicroMarketRoutes");
const footerLinkFaqRoutes = require("./routes/footerLinkFaqRoutes");
const footerLinkMicroMarketFaqRoutes = require("./routes/footerLinkMicroMarketFaqRoutes");
const generalSettingsRoutes = require("./routes/generalSettingsRoutes");
const propertyRoutes = require("./routes/PropertyRoutes");
const jobEnquiryRoutes = require("./routes/enquiryroutes/jobEnquiryRoutes");
const postRequirementRoutes = require("./routes/enquiryroutes/postRequirementRoutes");
const propertyEnquiryListRoutes = require("./routes/enquiryroutes/propertyEnquiryListRoutes");
const contactEnquiryRoutes = require("./routes/enquiryroutes/contactEnquiryRoutes");
const ownerRoutes = require("./routes/propertyusersroutes/ownerRoutes");
const brokerRoutes = require("./routes/propertyusersroutes/brokerRoutes");
const CreditPackagesroutes = require("./routes/Packageroutes/CreditPackagesroutes");
const paymentRoutes = require("./routes/Packageroutes/paymentRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

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

// Testimonial routes
app.use("/api/testimonials", testimonialRoutes);

// footerlinks routes
app.use("/api/footerlinks", footerLinksRoutes);

// footerlinks micro market routes
app.use("/api/footer-links-micro-market", footerLinksMicroMarketRoutes);

// footerlinks micro market routes
app.use("/api/footer-link-faqs", footerLinkFaqRoutes);

// footerlinks micro market routes
app.use("/api/footer-link-micro-market-faqs", footerLinkMicroMarketFaqRoutes);

// general settings routes
app.use("/api/generalsettings", generalSettingsRoutes);

// property routes
app.use("/api/properties", propertyRoutes);

// property routes
app.use("/api/jobenquiries", jobEnquiryRoutes);

// post requirements routes
app.use("/api/post-requirements", postRequirementRoutes);

// property enquiry list
app.use("/api/property-enquiry-list", propertyEnquiryListRoutes);

// contact enquiries
app.use("/api/contactenquiries", contactEnquiryRoutes);

// owner routes
app.use("/api/owners", ownerRoutes);

// broker routes
app.use("/api/brokers", brokerRoutes);

app.use("/api/creditpackages", CreditPackagesroutes);

// Payment routes
app.use("/api/payments", paymentRoutes);

// contact us
app.use("/api/contact-us", contactRoutes);

// fake route for testing
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

module.exports = app;
