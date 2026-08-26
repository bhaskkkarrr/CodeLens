import dotenv from "dotenv";
dotenv.config();

if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error("No GITHUB_CLIENT_ID found in environment variables");
}
if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error("No GITHUB_CLIENT_SECRET found in environment variables");
}
if (!process.env.JWT_SECRET) {
  throw new Error("No JWT_SECRET found in environment variables");
}
if (!process.env.MONGODB_URI) {
  throw new Error("No MONGODB_URI found in environment variables");
}
if (!process.env.CLOUDINARY_SECRET_KEY) {
  throw new Error("No CLOUDINARY_SECRET_KEY found in environment variables");
}
if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("No CLOUDINARY_API_KEY found in environment variables");
}
if (!process.env.CLOUD_NAME) {
  throw new Error("No CLOUD_NAME found in environment variables");
}

const config = {
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY,
};
export default config;
