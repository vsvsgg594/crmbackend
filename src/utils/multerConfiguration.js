import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/; 
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    
    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Only images (jpeg, jpg, png, gif) and PDFs are allowed!"), false);
    }
};

// ⚡ Allow profile image, Aadhaar image, and optional PDF file
const upload = multer({ storage, fileFilter }).fields([
    { name: "profileImage", maxCount: 1 },
    { name: "aadhaarImage", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 }  // Optional PDF upload
]);

export { upload };
