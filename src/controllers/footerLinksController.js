const FooterLink = require("../models/FooterLink");
const slugify = require("slugify");
const PropertyType = require("../models/Master/PropertyType");
const City = require("../models/Master/City");


// without auto ganret title

// // Add
// const addFooterLink = async (req, res) => {
//     try {
//         const data = req.body;

//         // Generate slug automatically
//         const generatedSlug = data.slug
//             ? slugify(data.slug, { lower: true, strict: true })
//             : slugify(data.title, { lower: true, strict: true });
//         data.slug = generatedSlug;

//         // Handle multiple uploaded files
//         if (req.files && req.files.galleryImages) {
//             data.galleryImages = req.files.galleryImages.map(file => `/${file.path.replace(/\\/g, '/')}`);
//         }

//         // Ensure galleryUrls is always an array
//         if (data.galleryUrls && !Array.isArray(data.galleryUrls)) {
//             data.galleryUrls = [data.galleryUrls];
//         }

//         const footerLink = new FooterLink(data);
//         await footerLink.save();

//         res.json({ status: true, message: "Footer link added", data: footerLink });
//     } catch (err) {
//         if (err.code === 11000 && err.keyValue?.slug) {
//             return res.status(400).json({ status: false, message: `Slug "${err.keyValue.slug}" already exists.` });
//         }
//         res.status(500).json({ status: false, message: err.message });
//     }
// };

// // Edit
// const editFooterLink = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const data = req.body;

//         // Auto-generate slug if not provided
//         if (data.title || data.slug) {
//             const generatedSlug = data.slug
//                 ? slugify(data.slug, { lower: true, strict: true })
//                 : slugify(data.title, { lower: true, strict: true });
//             data.slug = generatedSlug;
//         }

//         if (req.files && req.files.galleryImages) {
//             data.galleryImages = req.files.galleryImages.map(file => `/${file.path.replace(/\\/g, '/')}`);
//         }

//         if (data.galleryUrls && !Array.isArray(data.galleryUrls)) {
//             data.galleryUrls = [data.galleryUrls];
//         }

//         const footerLink = await FooterLink.findByIdAndUpdate(id, data, { new: true, runValidators: true });
//         if (!footerLink) return res.status(404).json({ status: false, message: "Not found" });

//         res.json({ status: true, message: "Footer link updated", data: footerLink });
//     } catch (err) {
//         if (err.code === 11000 && err.keyValue?.slug) {
//             return res.status(400).json({ status: false, message: `Slug "${err.keyValue.slug}" already exists.` });
//         }
//         res.status(500).json({ status: false, message: err.message });
//     }
// };


// Get All


// Add
const addFooterLink = async (req, res) => {
    try {
        const data = req.body;

        // If propertyType & city IDs provided, fetch their names
        if (data.propertyType && data.city) {
            const [propertyTypeDoc, cityDoc] = await Promise.all([
                PropertyType.findById(data.propertyType).select("name"),
                City.findById(data.city).select("name")
            ]);

            if (!propertyTypeDoc || !cityDoc) {
                return res.status(400).json({ status: false, message: "Invalid property type or city" });
            }

            data.title = `${propertyTypeDoc.name} of ${cityDoc.name}`;
        }

        // Generate slug automatically
        const generatedSlug = data.slug
            ? slugify(data.slug, { lower: true, strict: true })
            : slugify(data.title, { lower: true, strict: true });
        data.slug = generatedSlug;

        // Handle multiple uploaded files
        if (req.files && req.files.galleryImages) {
            data.galleryImages = req.files.galleryImages.map(file =>
                `/${file.path.replace(/\\/g, '/')}`
            );
        }

        // Ensure galleryUrls is always an array
        if (data.galleryUrls && !Array.isArray(data.galleryUrls)) {
            data.galleryUrls = [data.galleryUrls];
        }

        const footerLink = new FooterLink(data);
        await footerLink.save();

        res.json({ status: true, message: "Footer link added", data: footerLink });
    } catch (err) {
        if (err.code === 11000 && err.keyValue?.slug) {
            return res.status(400).json({ status: false, message: `Slug "${err.keyValue.slug}" already exists.` });
        }
        res.status(500).json({ status: false, message: err.message });
    }
};

// Edit

const editFooterLink = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // If propertyType & city IDs provided, fetch their names
        if (data.propertyType && data.city) {
            const [propertyTypeDoc, cityDoc] = await Promise.all([
                PropertyType.findById(data.propertyType).select("name"),
                City.findById(data.city).select("name")
            ]);

            if (!propertyTypeDoc || !cityDoc) {
                return res.status(400).json({ status: false, message: "Invalid property type or city" });
            }

            data.title = `${propertyTypeDoc.name} of ${cityDoc.name}`;
        }

        // Auto-generate slug if title or slug provided
        if (data.title || data.slug) {
            const generatedSlug = data.slug
                ? slugify(data.slug, { lower: true, strict: true })
                : slugify(data.title, { lower: true, strict: true });
            data.slug = generatedSlug;
        }

        if (req.files && req.files.galleryImages) {
            data.galleryImages = req.files.galleryImages.map(file =>
                `/${file.path.replace(/\\/g, '/')}`
            );
        }

        if (data.galleryUrls && !Array.isArray(data.galleryUrls)) {
            data.galleryUrls = [data.galleryUrls];
        }

        const footerLink = await FooterLink.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!footerLink) {
            return res.status(404).json({ status: false, message: "Not found" });
        }

        res.json({ status: true, message: "Footer link updated", data: footerLink });
    } catch (err) {
        if (err.code === 11000 && err.keyValue?.slug) {
            return res.status(400).json({ status: false, message: `Slug "${err.keyValue.slug}" already exists.` });
        }
        res.status(500).json({ status: false, message: err.message });
    }
};



// const getFooterLinks = async (req, res) => {
//     try {
//         const footerLinks = await FooterLink.find()
//             .populate("propertyType", "name")
//             .populate("city", "name image")
//             .sort({ createdAt: -1 });

//         const updatedLinks = footerLinks.map(link => ({
//             ...link.toObject(),
//             galleryImages: link.galleryImages.map(img => `${process.env.BACKEND_URL}${img}`)
//         }));

//         res.json({ status: true, message: "Footer links fetched successfully", data: updatedLinks });
//     } catch (err) {
//         res.status(500).json({ status: false, message: err.message });
//     }
// };

// Get by ID

const getFooterLinks = async (req, res) => {
    try {
        const footerLinks = await FooterLink.find()
            .populate("propertyType", "name")
            .populate("city", "name image")
            .sort({ createdAt: -1 });

        const updatedLinks = footerLinks.map(link => {
            const linkObject = link.toObject();

            // Handle galleryImages
            const galleryImages = linkObject.galleryImages || [];
            const updatedGalleryImages = galleryImages.map(img =>
                `${process.env.BACKEND_URL}${img.startsWith('/') ? img : `/${img}`}`
            );

            // Handle city.image
            let updatedCity = null;
            if (linkObject.city) {
                updatedCity = {
                    ...linkObject.city,
                    image: linkObject.city.image
                        ? `${process.env.BACKEND_URL}${linkObject.city.image.startsWith('/') ? linkObject.city.image : `/${linkObject.city.image}`}`
                        : null
                };
            }

            return {
                ...linkObject,
                galleryImages: updatedGalleryImages,
                city: updatedCity
            };
        });

        res.json({
            status: true,
            message: "Footer links fetched successfully",
            data: updatedLinks
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
};

const getFooterLinkById = async (req, res) => {
    try {
        const footerLink = await FooterLink.findById(req.params.id)
            .populate("propertyType", "name")
            .populate("city", "name");

        if (!footerLink) return res.status(404).json({ status: false, message: "Not found" });

        const updatedLink = {
            ...footerLink.toObject(),
            galleryImages: footerLink.galleryImages.map(img => `${process.env.BACKEND_URL}${img}`)
        };

        res.json({ status: true, message: "Footer link fetched successfully", data: updatedLink });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// Get by Slug
const getFooterLinkBySlug = async (req, res) => {
    try {
        const footerLink = await FooterLink.findOne({ slug: req.params.slug })
            .populate("propertyType", "name")
            .populate("city", "name");

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
const deleteFooterLink = async (req, res) => {
    try {
        const footerLink = await FooterLink.findByIdAndDelete(req.params.id);
        if (!footerLink) return res.status(404).json({ status: false, message: "Not found" });

        res.json({ status: true, message: "Footer link deleted" });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = {
    addFooterLink,
    editFooterLink,
    getFooterLinks,
    getFooterLinkById,
    getFooterLinkBySlug,
    deleteFooterLink
};
