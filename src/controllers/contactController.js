const csv = require("csv-parser");
const XLSX = require("xlsx");
const fs = require("fs");
const Contact = require("../models/contact");

// 📌 Get all contacts
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json({
            status: true,
            message: "Contacts fetched statusfully",
            contacts: contacts
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Get single contact
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ error: "Contact not found" });
        res.json({
            status: true,
            message: "Contact fetched statusfully",
            contact: contact
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Add contact
const addContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({
            status: true,
            message: "Contact added statusfully",
            contact: contact
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Update contact
const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contact) return res.status(404).json({ error: "Contact not found" });
        res.json({
            status: true,
            message: "Contact updated statusfully",
            contact: contact
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Delete contact
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ error: "Contact not found" });
        res.json({
            status: true,
            contact: contact,
            message: "Contact deleted"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Upload CSV/Excel for multiple contacts (skip duplicates)
const uploadContacts = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const filePath = req.file.path;
        const ext = req.file.originalname.split(".").pop().toLowerCase();

        let parsedContacts = [];

        if (ext === "csv") {
            // Parse CSV
            const results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (data) => results.push(data))
                .on("end", async () => {
                    parsedContacts = results;
                    await handleBulkInsert(parsedContacts, res, filePath);
                });
        } else if (ext === "xlsx") {
            // Parse Excel
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            parsedContacts = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            await handleBulkInsert(parsedContacts, res, filePath);
        } else {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: "Invalid file format. Only CSV/XLSX supported." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Helper function to handle duplicate check & insert
const handleBulkInsert = async (parsedContacts, res, filePath) => {
    try {
        const inserted = [];
        const skipped = [];

        for (let contact of parsedContacts) {
            const exists = await Contact.findOne({
                $or: [{ email: contact.email }, { phone: contact.phone }],
            });

            if (exists) {
                skipped.push(contact);
            } else {
                const newContact = new Contact(contact);
                await newContact.save();
                inserted.push(newContact);
            }
        }

        fs.unlinkSync(filePath);

        res.json({
            status: true,
            message: `Contacts processed. Inserted: ${inserted.length}, Skipped (duplicates): ${skipped.length}`,
            inserted,
            skipped,
        });
    } catch (err) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    getContacts,
    getContactById,
    addContact,
    updateContact,
    deleteContact,
    uploadContacts,
};
