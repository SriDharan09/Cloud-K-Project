const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const allowedFileTypes = /jpeg|jpg|png|webp/;

const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(6).toString("hex");
  const sanitizedFilename = originalName
    .replace(/\s+/g, "-") 
    .replace(/[^a-zA-Z0-9.-]/g, ""); 
  return `${sanitizedFilename}-${timestamp}-${randomString}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    const uniqueFilename =
      generateUniqueFilename(path.parse(file.originalname).name) +
      path.extname(file.originalname);
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPG, JPEG, PNG, WEBP) are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter,
});

module.exports = upload;
