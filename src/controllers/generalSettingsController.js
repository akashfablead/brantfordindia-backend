// const path = require("path");
// const GeneralSettings = require("../models/GeneralSettings");

// // Helper to build full URL
// const getFullUrl = (filePath) => {
//     if (!filePath) return "";
//     // If it's already a full URL, return it as is
//     if (filePath.startsWith("http")) return filePath;
//     // Construct the full URL using the backend base URL
//     return `${process.env.BACKEND_URL}/${filePath.replace(/\\/g, "/")}`;
// };


// // Helper
// function parseArrayFields(reqBody, fieldNames) {
//     let arr = [];

//     // Support both with/without [] in key
//     const keys = fieldNames.map(f => f.replace("[]", ""));

//     // Case 1: If first field exists and is an array
//     if (Array.isArray(reqBody[fieldNames[0]]) || Array.isArray(reqBody[keys[0]])) {
//         const length = (reqBody[fieldNames[0]] || reqBody[keys[0]]).length;
//         for (let i = 0; i < length; i++) {
//             let obj = {};
//             fieldNames.forEach(field => {
//                 const cleanKey = field.replace("[]", "");
//                 const value = reqBody[field] || reqBody[cleanKey];
//                 if (value && Array.isArray(value) && value[i] !== undefined) {
//                     obj[cleanKey] = value[i];
//                 }
//             });
//             if (Object.keys(obj).length) arr.push(obj);
//         }
//     }
//     // Case 2: JSON string
//     else if (
//         typeof reqBody[fieldNames[0]] === "string" &&
//         reqBody[fieldNames[0]].trim().startsWith("[")
//     ) {
//         try {
//             arr = JSON.parse(reqBody[fieldNames[0]]);
//         } catch (err) {
//             console.error(`Error parsing JSON for ${fieldNames[0]}:`, err);
//         }
//     }
//     // Case 3: Single value
//     else {
//         let obj = {};
//         fieldNames.forEach(field => {
//             const cleanKey = field.replace("[]", "");
//             if (reqBody[field] !== undefined || reqBody[cleanKey] !== undefined) {
//                 obj[cleanKey] = reqBody[field] || reqBody[cleanKey];
//             }
//         });
//         if (Object.keys(obj).length) arr.push(obj);
//     }

//     return arr;
// }

// // Add or Edit General Settings (Upsert by Type)
// const addOrEditGeneralSettings = async (req, res) => {
//     try {
//         const { type } = req.body;
//         if (!type) {
//             return res.status(400).json({ status: false, message: "Type is required" });
//         }

//         let data = { ...req.body };

//         if (type === "why_choose") {
//             let whyChooseArr = parseArrayFields(req.body, ["title[]", "description[]"]);

//             // Attach icons (from file upload or body)
//             if (req.files && req.files["icon[]"]) {
//                 whyChooseArr.forEach((obj, i) => {
//                     obj.icon = req.files["icon[]"][i] ? req.files["icon[]"][i].path : "";
//                 });
//             } else {
//                 const icons = req.body["icon[]"] || req.body["icon"] || [];
//                 whyChooseArr.forEach((obj, i) => {
//                     if (Array.isArray(icons)) obj.icon = icons[i] || "";
//                     else obj.icon = icons;
//                 });
//             }

//             data.whyChoose = whyChooseArr;
//         }



//         // Handle other uploads (home / about_us etc.)
//         if (req.files) {
//             if (req.files.homePageBanner) {
//                 data.homePageBanner = req.files.homePageBanner[0].path;
//             }
//             if (req.files.aboutUsImage) {
//                 data.aboutUsImage = req.files.aboutUsImage[0].path;
//             }
//         }

//         // Save or update
//         const updated = await GeneralSettings.findOneAndUpdate(
//             { type },
//             data,
//             { new: true, upsert: true }
//         );

//         // Convert file paths to full URLs
//         if (updated?.homePageBanner) {
//             updated.homePageBanner = getFullUrl(req, updated.homePageBanner);
//         }
//         if (updated?.aboutUsImage) {
//             updated.aboutUsImage = getFullUrl(req, updated.aboutUsImage);
//         }
//         if (updated?.whyChoose?.length) {
//             updated.whyChoose = updated.whyChoose.map((item) => ({
//                 ...item,
//                 icon: item.icon ? getFullUrl(req, item.icon) : ""
//             }));
//         }

//         return res.json({
//             status: true,
//             message: "Settings saved successfully",
//             data: updated
//         });
//     } catch (error) {
//         return res.status(500).json({ status: false, message: error.message });
//     }
// };



// // Get All
// const getGeneralSettings = async (req, res) => {
//     try {
//         const list = await GeneralSettings.find().lean(); // ✅ lean()

//         // Add full URLs
//         const formattedList = list.map(item => ({
//             ...item,
//             homePageBanner: getFullUrl(req, item.homePageBanner),
//             aboutUsImage: getFullUrl(req, item.aboutUsImage),
//             whyChoose: item.whyChoose?.map(choice => ({
//                 ...choice,
//                 icon: getFullUrl(req, choice.icon),
//             })) || []
//         }));

//         res.json({ status: true, data: formattedList });
//     } catch (error) {
//         res.status(500).json({ status: false, message: error.message });
//     }
// };

// // Get by Type
// const getGeneralSettingsByType = async (req, res) => {
//     try {
//         const { type } = req.params;
//         const settings = await GeneralSettings.findOne({ type }).lean(); // ✅ lean()

//         if (!settings) {
//             return res.status(404).json({ status: false, message: "Not found" });
//         }

//         const formatted = {
//             ...settings,
//             homePageBanner: getFullUrl(req, settings.homePageBanner),
//             aboutUsImage: getFullUrl(req, settings.aboutUsImage),
//             whyChoose: settings.whyChoose?.map(choice => ({
//                 ...choice,
//                 icon: getFullUrl(req, choice.icon),
//             })) || []
//         };

//         res.json({ status: true, data: formatted });
//     } catch (error) {
//         res.status(500).json({ status: false, message: error.message });
//     }
// };


// // Delete by ID
// const deleteGeneralSettings = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deleted = await GeneralSettings.findByIdAndDelete(id);
//         if (!deleted) {
//             return res.status(404).json({ status: false, message: "Not found" });
//         }
//         res.json({ status: true, message: "Deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ status: false, message: error.message });
//     }
// };

// module.exports = {
//     addOrEditGeneralSettings,
//     getGeneralSettings,
//     getGeneralSettingsByType,
//     deleteGeneralSettings
// };


const path = require("path");
const GeneralSettings = require("../models/GeneralSettings");

// Helper to build full URL using environment variable
const getFullUrl = (filePath) => {
    if (!filePath) return "";
    // If it's already a full URL, return it as is
    if (filePath.startsWith("http")) return filePath;
    // Construct the full URL using the backend base URL
    return `${process.env.BACKEND_URL}/${filePath.replace(/\\/g, "/")}`;
};


// Helper to parse form data for array fields
function parseArrayFields(reqBody, fieldNames) {
    let arr = [];

    // Support both with/without [] in key
    const keys = fieldNames.map(f => f.replace("[]", ""));

    // Case 1: If first field exists and is an array
    if (Array.isArray(reqBody[fieldNames[0]]) || Array.isArray(reqBody[keys[0]])) {
        const length = (reqBody[fieldNames[0]] || reqBody[keys[0]]).length;
        for (let i = 0; i < length; i++) {
            let obj = {};
            fieldNames.forEach(field => {
                const cleanKey = field.replace("[]", "");
                const value = reqBody[field] || reqBody[cleanKey];
                if (value && Array.isArray(value) && value[i] !== undefined) {
                    obj[cleanKey] = value[i];
                }
            });
            if (Object.keys(obj).length) arr.push(obj);
        }
    }
    // Case 2: JSON string
    else if (
        typeof reqBody[fieldNames[0]] === "string" &&
        reqBody[fieldNames[0]].trim().startsWith("[")
    ) {
        try {
            arr = JSON.parse(reqBody[fieldNames[0]]);
        } catch (err) {
            console.error(`Error parsing JSON for ${fieldNames[0]}:`, err);
        }
    }
    // Case 3: Single value
    else {
        let obj = {};
        fieldNames.forEach(field => {
            const cleanKey = field.replace("[]", "");
            if (reqBody[field] !== undefined || reqBody[cleanKey] !== undefined) {
                obj[cleanKey] = reqBody[field] || reqBody[cleanKey];
            }
        });
        if (Object.keys(obj).length) arr.push(obj);
    }

    return arr;
}

// Add or Edit General Settings (Upsert by Type)
const addOrEditGeneralSettings = async (req, res) => {
    try {
        const { type } = req.body;
        if (!type) {
            return res.status(400).json({ status: false, message: "Type is required" });
        }

        let data = { ...req.body };

        if (type === "why_choose") {
            let whyChooseArr = parseArrayFields(req.body, ["title[]", "description[]"]);

            // Attach icons (from file upload or body)
            if (req.files && req.files["icon[]"]) {
                whyChooseArr.forEach((obj, i) => {
                    obj.icon = req.files["icon[]"][i] ? req.files["icon[]"][i].path : "";
                });
            } else {
                const icons = req.body["icon[]"] || req.body["icon"] || [];
                whyChooseArr.forEach((obj, i) => {
                    if (Array.isArray(icons)) obj.icon = icons[i] || "";
                    else obj.icon = icons;
                });
            }

            data.whyChoose = whyChooseArr;
        }



        // Handle other uploads (home / about_us etc.)
        if (req.files) {
            if (req.files.homePageBanner) {
                data.homePageBanner = req.files.homePageBanner[0].path;
            }
            if (req.files.aboutUsImage) {
                data.aboutUsImage = req.files.aboutUsImage[0].path;
            }
        }

        // Save or update
        const updated = await GeneralSettings.findOneAndUpdate(
            { type },
            data,
            { new: true, upsert: true }
        );

        // Convert file paths to full URLs
        if (updated?.homePageBanner) {
            updated.homePageBanner = getFullUrl(updated.homePageBanner);
        }
        if (updated?.aboutUsImage) {
            updated.aboutUsImage = getFullUrl(updated.aboutUsImage);
        }
        if (updated?.whyChoose?.length) {
            updated.whyChoose = updated.whyChoose.map((item) => ({
                ...item,
                icon: item.icon ? getFullUrl(item.icon) : ""
            }));
        }

        return res.json({
            status: true,
            message: "Settings saved successfully",
            data: updated
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};



// Get All
const getGeneralSettings = async (req, res) => {
    try {
        const list = await GeneralSettings.find().lean(); // ✅ lean()

        // Add full URLs
        const formattedList = list.map(item => ({
            ...item,
            homePageBanner: getFullUrl(item.homePageBanner),
            aboutUsImage: getFullUrl(item.aboutUsImage),
            whyChoose: item.whyChoose?.map(choice => ({
                ...choice,
                icon: getFullUrl(choice.icon),
            })) || []
        }));

        res.json({ status: true, data: formattedList });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Get by Type
const getGeneralSettingsByType = async (req, res) => {
    try {
        const { type } = req.params;
        const settings = await GeneralSettings.findOne({ type }).lean(); // ✅ lean()

        if (!settings) {
            return res.status(404).json({ status: false, message: "Not found" });
        }

        const formatted = {
            ...settings,
            homePageBanner: getFullUrl(settings.homePageBanner),
            aboutUsImage: getFullUrl(settings.aboutUsImage),
            whyChoose: settings.whyChoose?.map(choice => ({
                ...choice,
                icon: getFullUrl(choice.icon),
            })) || []
        };

        res.json({ status: true, data: formatted });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


// Delete by ID
const deleteGeneralSettings = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await GeneralSettings.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ status: false, message: "Not found" });
        }
        res.json({ status: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    addOrEditGeneralSettings,
    getGeneralSettings,
    getGeneralSettingsByType,
    deleteGeneralSettings
};