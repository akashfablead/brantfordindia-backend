const slugify = require("slugify");
const FooterLink = require("../models/FooterLink");
const Micromarket = require("../models/Master/Micromarket");
const FooterLinksMicroMarket = require("../models/FooterLinksMicroMarket");

// Add
const addFooterLinksMicroMarket = async (req, res) => {
    try {
        const data = req.body;

        // Auto-generate title if IDs provided
        if (data.FooterLink && data.microMarket) {
            const [FooterLinkDoc, microMarketDoc] = await Promise.all([
                FooterLink.findById(data.FooterLink)
                    .populate("propertyType", "name")
                    .select("propertyType"),
                Micromarket.findById(data.microMarket).select("name")
            ]);

            if (!FooterLinkDoc || !microMarketDoc) {
                return res.status(400).json({ status: false, message: "Invalid property type, micro market" });
            }

            data.title = `${FooterLinkDoc.propertyType.name} of ${microMarketDoc.name}`;
        }

        // Generate slug
        data.slug = slugify(data.slug || data.title, { lower: true, strict: true });

        // Handle file uploads
        if (req.files && req.files.galleryImages) {
            data.galleryImages = req.files.galleryImages.map(file => `/${file.path.replace(/\\/g, '/')}`);
        }

        if (data.galleryUrls && !Array.isArray(data.galleryUrls)) {
            data.galleryUrls = [data.galleryUrls];
        }

        const footerLink = new FooterLinksMicroMarket(data);
        await footerLink.save();

        res.json({ status: true, message: "FooterLinksMicroMarket added", data: footerLink });
    } catch (err) {
        if (err.code === 11000 && err.keyValue?.slug) {
            return res.status(400).json({ status: false, message: `Slug "${err.keyValue.slug}" already exists.` });
        }
        res.status(500).json({ status: false, message: err.message });
    }
};

// Edit
const editFooterLinksMicroMarket = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.FooterLink && data.microMarket) {
            const [FooterLinkDoc, microMarketDoc] = await Promise.all([
                FooterLink.findById(data.FooterLink)
                    .populate("propertyType", "name")
                    .select("propertyType"),
                Micromarket.findById(data.microMarket).select("name")
            ]);

            if (!FooterLinkDoc | !microMarketDoc) {
                return res.status(400).json({ status: false, message: "Invalid property type,  micro market" });
            }

            data.title = `${FooterLinkDoc.propertyType.name} of ${microMarketDoc.name}`;
        }

        if (data.title || data.slug) {
            data.slug = slugify(data.slug || data.title, { lower: true, strict: true });
        }

        if (req.files && req.files.galleryImages) {
            data.galleryImages = req.files.galleryImages.map(file => `/${file.path.replace(/\\/g, '/')}`);
        }

        if (data.galleryUrls && !Array.isArray(data.galleryUrls)) {
            data.galleryUrls = [data.galleryUrls];
        }

        const footerLink = await FooterLinksMicroMarket.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!footerLink) return res.status(404).json({ status: false, message: "Not found" });

        res.json({ status: true, message: "FooterLinksMicroMarket updated", data: footerLink });
    } catch (err) {
        if (err.code === 11000 && err.keyValue?.slug) {
            return res.status(400).json({ status: false, message: `Slug "${err.keyValue.slug}" already exists.` });
        }
        res.status(500).json({ status: false, message: err.message });
    }
};

// Get All
const getFooterLinksMicroMarket = async (req, res) => {
    try {
        const footerLinks = await FooterLinksMicroMarket.find()
            .populate("FooterLink", "title")
            .populate("microMarket", "name")
            .sort({ createdAt: -1 });

        const updatedLinks = footerLinks.map(link => ({
            ...link.toObject(),
            galleryImages: link.galleryImages.map(img => `${process.env.BACKEND_URL}${img}`)
        }));

        res.json({ status: true, data: updatedLinks });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// Get by ID
const getFooterLinksMicroMarketById = async (req, res) => {
    try {
        const footerLink = await FooterLinksMicroMarket.findById(req.params.id)
            .populate("FooterLink", "title")
            .populate("microMarket", "name");

        if (!footerLink) return res.status(404).json({ status: false, message: "Not found" });

        const updatedLink = {
            ...footerLink.toObject(),
            galleryImages: footerLink.galleryImages.map(img => `${process.env.BACKEND_URL}${img}`)
        };

        res.json({ status: true, data: updatedLink });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// Get by Slug
const getFooterLinksMicroMarketBySlug = async (req, res) => {
    try {
        const footerLink = await FooterLinksMicroMarket.findOne({ slug: req.params.slug })
            .populate("FooterLink", "title")
            .populate("microMarket", "name");

        if (!footerLink) return res.status(404).json({ status: false, message: "Not found" });

        const updatedLink = {
            ...footerLink.toObject(),
            galleryImages: footerLink.galleryImages.map(img => `${process.env.BACKEND_URL}${img}`)
        };

        res.json({ status: true, data: updatedLink });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// Delete
const deleteFooterLinksMicroMarket = async (req, res) => {
    try {
        const footerLink = await FooterLinksMicroMarket.findByIdAndDelete(req.params.id);
        if (!footerLink) return res.status(404).json({ status: false, message: "Not found" });

        res.json({ status: true, message: "FooterLinksMicroMarket deleted" });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = {
    addFooterLinksMicroMarket,
    editFooterLinksMicroMarket,
    getFooterLinksMicroMarket,
    getFooterLinksMicroMarketById,
    getFooterLinksMicroMarketBySlug,
    deleteFooterLinksMicroMarket
};
