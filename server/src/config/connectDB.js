import mongoose from "mongoose";
import config from "./config.js";
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to Database");
  } catch (error) {
    throw new Error("Error connecting to database");
  }
};
export default connectDB;
