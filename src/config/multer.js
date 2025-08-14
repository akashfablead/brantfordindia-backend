
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const createMulterUpload = (folderName) => {
//     const uploadPath = path.join("uploads", folderName);

//     // Create folder if not exists
//     if (!fs.existsSync(uploadPath)) {
//         fs.mkdirSync(uploadPath, { recursive: true });
//     }

//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, uploadPath); // use auto-created folder
//         },
//         filename: function (req, file, cb) {
//             const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//             const ext = path.extname(file.originalname);
//             cb(null, file.fieldname + "-" + uniqueSuffix + ext);
//         },
//     });

//     const fileFilter = (req, file, cb) => {
//         const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
//         if (allowedTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error("Only JPEG, PNG, and WEBP files are allowed"), false);
//         }
//     };

//     return multer({
//         storage,
//         fileFilter,
//         limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
//     });
// };

// module.exports = createMulterUpload;


const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createMulterUpload = (folderName) => {
    const uploadPath = path.join("uploads", folderName);

    // Create folder if not exists
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + "-" + uniqueSuffix + ext);
        },
    });

    const fileFilter = (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, PNG, WEBP, PDF, DOC, and DOCX files are allowed"), false);
        }
    };

    return multer({
        storage,
        fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max for CVs
    });
};

module.exports = createMulterUpload;
