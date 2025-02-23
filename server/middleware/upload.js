const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// DEBUG: Log Cloudinary Config
console.log("🟢 Cloudinary Configuration Loaded:");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing");
console.log("API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing");

const createUploadMiddleware = (folderName = "general") => {
  try {
    console.log(`📂 Initializing Upload Middleware for Folder: ${folderName}`);

    if (!cloudinary) {
      throw new Error("Cloudinary instance is not initialized.");
    }

    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: folderName,
        format: async (req, file) => {
          try {
            console.log("🟡 Processing File:", file.originalname);
            return "png";
          } catch (err) {
            console.error("❌ Error determining file format:", err);
            throw new Error("File format error");
          }
        },
        public_id: (req, file) => {
          try {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            console.log("🟢 Generated Unique Filename:", uniqueName);
            return uniqueName;
          } catch (err) {
            console.error("❌ Error generating public_id:", err);
            throw new Error("Filename generation error");
          }
        },
      },
    });

    console.log("✅ Multer Middleware Initialized Successfully");
    return multer({ storage });

  } catch (error) {
    console.error("❌ Error Initializing Upload Middleware:", error);
    throw new Error("Failed to initialize multer middleware.");
  }
};



module.exports = createUploadMiddleware;
