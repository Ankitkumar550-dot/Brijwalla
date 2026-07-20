import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "PRESENT" : "MISSING");

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

try {
  console.log("Attempting test upload...");
  // Upload a tiny transparent pixel to test
  const result = await cloudinary.uploader.upload("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
  console.log("Upload Success!", result.secure_url);
} catch (error) {
  console.error("Upload Failed Error Object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
}
