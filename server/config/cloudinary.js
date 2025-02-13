const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

console.log("Cloudinary Config Test:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "***** (hidden)" : "MISSING",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dwwqvhsge",
  api_key: process.env.CLOUDINARY_API_KEY || "169873316231468",
  api_secret: "7WapcJcNKptWWkt5deMdVEzIKOI",
});
console.log("Cloudinary Config:", cloudinary.config()); // Log config before using Cloudinary

module.exports = cloudinary;
