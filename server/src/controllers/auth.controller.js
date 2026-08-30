import User from "../models/user.model.js";
import crypto from "crypto";
import cloudinaryUpload from "../service/cloudinaryUpload.js";
import { createSession } from "../service/createSession.js";

export const register = async (req, res) => {
  console.log(req.firebaseUser);
  let { email, uid } = req.firebaseUser;
  let { password, username } = req.body;
  try {
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
      username = email.split("@")[0].toUpperCase();
    }
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      firebaseuid: uid,
    });

    return res.status(201).json({
      success: true,
      message: "User registered",
      user: {
        email: user.email,
        username: user.username,
        credits: user.credits,
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
  try {
    const { email } = req.firebaseUser;
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while signing up user",
    });
  }
};

export const firebaseAuth = async (req, res) => {
  try {
    const { email, name, picture, uid } = req.firebaseUser;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      let url = null;
      if (picture) {
        const response = await cloudinaryUpload(picture);
        if (response.success) {
          url = response.url;
        }
      }
      const newUser = await User.create({
        email,
        username: name,
        profilePic: url,
        firebaseuid: uid,
      });
      user = newUser;
    }
    console.log("USER", user);
    const session = await createSession(user, req);
    console.log("SESSION", session);
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
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Error while logging user",
        error: session.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while logging in user",
    });
  }
};

export const me = async (req, res) => {};
export const logout = async (req, res) => {};
