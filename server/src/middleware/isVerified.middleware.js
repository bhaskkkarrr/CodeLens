import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../models/user.model.js";
export const isVerified = async (req, res, next) => {
  try {
    
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
      return res.status(402).json({
        success: false,
        message: "Not a valid user, access denied",
      });
    }

    if (authHeader.split(" ")[0] != "Bearer") {
      return res.status(402).json({
        success: false,
        message: "Invalid token, access denied",
      });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (!decoded) {
      return res.status(402).json({
        success: false,
        message: "Invalid token, access denied",
      });
    }
    console.log("Decoded:\n", decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(402).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(402).json({
      success: false,
      message: "User verify middlware server error",
      error,
    });
  }
};
