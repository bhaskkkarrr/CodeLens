import Session from "../models/session.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

export const createSession = async (user, req) => {
  try {
    const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const newSession = await Session.create({
      userId: user._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      refreshTokenHash,
    });

    const accessToken = jwt.sign(
      { id: user._id, sessionId: newSession._id },
      config.JWT_SECRET,
      { expiresIn: "10m" },
    );
    return {
      success: true,
      message: "Session created successfully",
      session: newSession,
      token: accessToken,
      refreshToken,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error while creating session",
    };
  }
};
