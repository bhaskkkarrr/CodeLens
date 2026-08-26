import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import AuthIdentity from "../models/authIdentity.model.js";
import cloudinaryUpload from "../service/cloudinaryUpload.js";

async function createSession(user, req) {
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
}

export const register = async (req, res) => {
  let { email, password, username } = req.body;
  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (!username) {
      username = email.split("@")[0];
    }
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const authIdentity = await AuthIdentity.create({
      userId: user._id,
      provider: "email",
      providerID: user.email,
    });

    return res.status(201).json({
      success: true,
      message: "User registered",
      user: {
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while signing up user",
    });
  }
};

export const login = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password is required",
    });
  }
  const isUser = await User.findOne({ email });
  if (!isUser) {
    return res.status(400).json({
      success: false,
      message: "User not registered",
    });
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const isValidPassword = hashedPassword == isUser.password;

  if (!isValidPassword) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  const session = await createSession(isUser, req);
  if (session.success) {
    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000 * 7,
    });
    return res.status(200).json({
      success: true,
      message: "User logged in",
      token: session.token,
      user: {
        email: isUser.email,
        username: isUser.username,
        credits: isUser.credits,
      },
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Error while logging user",
      error: session.message,
    });
  }
};

export const googleAuth = async (req, res) => {
  const { email, username, profileUrl, providerID } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    if (!providerID) {
      return res.status(400).json({
        success: false,
        message: "Provider Id is required",
      });
    }

    let url = null;
    if (profileUrl) {
      const response = await cloudinaryUpload(profileUrl);
      if (response.success) {
        url = response.url;
      }
    }
    const newUser = await User.create({
      email,
      username,
      profileUrl: url,
      isVerified: true,
    });

    const authIdentity = await AuthIdentity.create({
      userId: newUser._id,
      provider: "google",
      providerId: providerID,
    });

    const session = await createSession(newUser, req);
    if (session.success) {
      res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000 * 7,
      });
      return res.status(200).json({
        success: true,
        message: "User logged in",
        token: session.token,
        user: {
          email: newUser.email,
          username: newUser.username,
          credits: newUser.credits,
        },
        authIdentity: {
          userId: authIdentity.userId,
          provider: authIdentity.provider,
          providerID: authIdentity.providerId,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Error while logging user",
        error: session.message,
      });
    }
  } else {
    let authIdentity = null;
    authIdentity = await AuthIdentity.findOne({
      $and: [{ userId: user._id }, { providerId: providerID }],
    });

    if (!authIdentity) {
      authIdentity = await AuthIdentity.create({
        userId: user._id,
        provider: "google",
        providerId: providerID,
      });
    }
    console.log("new", authIdentity);
    const session = await createSession(user, req);
    if (session.success) {
      res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000 * 7,
      });
      return res.status(200).json({
        success: true,
        message: "User logged in",
        token: session.token,
        user: {
          email: user.email,
          username: user.username,
          credits: user.credits,
        },
        authIdentity: {
          userId: authIdentity.userId,
          provider: authIdentity.provider,
          providerID: authIdentity.providerId,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Error while logging user",
        error: session.message,
      });
    }
  }
};

export const githubAuth = async (req, res) => {
  const { email, username, profileUrl, providerID } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    if (!providerID) {
      return res.status(400).json({
        success: false,
        message: "Provider Id is required",
      });
    }

    let url = null;
    if (profileUrl) {
      const response = await cloudinaryUpload(profileUrl);
      if (response.success) {
        url = response.url;
      }
    }
    const newUser = await User.create({
      email,
      username,
      profileUrl: url,
    });

    const authIdentity = await AuthIdentity.create({
      userId: newUser._id,
      provider: "github",
      providerId: providerID,
    });

    const session = await createSession(newUser, req);
    if (session.success) {
      res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000 * 7,
      });
      return res.status(200).json({
        success: true,
        message: "User logged in",
        token: session.token,
        user: {
          email: newUser.email,
          username: newUser.username,
          credits: newUser.credits,
        },
        authIdentity: {
          userId: authIdentity.userId,
          provider: authIdentity.provider,
          providerID: authIdentity.providerId,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Error while logging user",
        error: session.message,
      });
    }
  } else {
    let authIdentity = null;
    authIdentity = await AuthIdentity.findOne({
      $and: [{ userId: user._id }, { providerId: providerID }],
    });

    if (!authIdentity) {
      authIdentity = await AuthIdentity.create({
        userId: user._id,
        provider: "github",
        providerId: providerID,
      });
    }
    console.log("new", authIdentity);
    const session = await createSession(user, req);
    if (session.success) {
      res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000 * 7,
      });
      return res.status(200).json({
        success: true,
        message: "User logged in",
        token: session.token,
        user: {
          email: user.email,
          username: user.username,
          credits: user.credits,
        },
        authIdentity: {
          userId: authIdentity.userId,
          provider: authIdentity.provider,
          providerID: authIdentity.providerId,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Error while logging user",
        error: session.message,
      });
    }
  }
};

export const me = async (req, res) => {};
export const logout = async (req, res) => {};
