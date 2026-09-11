import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../models/user.model.js";
export const isVerified = async (req, res, next) => {
  try {
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (authHeader.split(" ")[0] != "Bearer") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_SECRET);
      if (!decoded) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }
      console.log("Decoded:\n", decoded);
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
        error,
      });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User verify server error",
      error,
    });
  }
};
