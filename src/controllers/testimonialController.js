const Testimonial = require("../models/Testimonial");


// Add Testimonial
const addTestimonial = async (req, res) => {
    try {
        const { name, description, position, companyName, status } = req.body;

        if (!name || !description || !position || !companyName) {
            return res.status(400).json({ status: false, message: "Required fields are missing" });
        }

        if (!req.file) {
            return res.status(400).json({ status: false, message: "Image is required" });
        }

        const imagePath = `/uploads/testimonials/${req.file.filename}`;

        const testimonial = new Testimonial({
            name,
            description,
            position,
            companyName,
            status,
            image: imagePath
        });

        await testimonial.save();
        res.status(201).json({ status: true, message: "Testimonial added successfully", testimonial });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Edit Testimonial
const editTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, position, companyName, status } = req.body;

        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({ status: false, message: "Testimonial not found" });
        }

        if (req.file) {
            testimonial.image = `/uploads/testimonials/${req.file.filename}`;
        }

        testimonial.name = name || testimonial.name;
        testimonial.description = description || testimonial.description;
        testimonial.position = position || testimonial.position;
        testimonial.companyName = companyName || testimonial.companyName;
        testimonial.status = status || testimonial.status;

        await testimonial.save();
        res.json({ status: true, message: "Testimonial updated successfully", testimonial });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get All Testimonials
const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find();

        const formatted = testimonials.map(t => ({
            ...t._doc,
            image: t.image ? `${process.env.BACKEND_URL}${t.image}` : null
        }));

        res.json({ status: true, testimonials: formatted });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get Testimonial by ID
const getTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) return res.status(404).json({ status: false, message: "Testimonial not found" });

        const fullImageUrl = testimonial.image ? `${process.env.BACKEND_URL}${testimonial.image}` : null;

        res.json({ status: true, testimonial: { ...testimonial._doc, image: fullImageUrl } });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Delete Testimonial
const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findByIdAndDelete(id);
        if (!testimonial) {
            return res.status(404).json({ status: false, message: "Testimonial not found" });
        }
        res.json({ status: true, message: "Testimonial deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    addTestimonial,
    editTestimonial,
    getTestimonials,
    getTestimonialById,
    deleteTestimonial
};
