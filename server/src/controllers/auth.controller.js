import User from "../models/user.model.js";
import crypto from "crypto";
import cloudinaryUpload from "../service/cloudinaryUpload.js";
import { createSession } from "../utils/createSession.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import Session from "../models/session.model.js";
import { generateHtmlForOtp, generateOTP } from "../utils/generateOTP.js";
import { sendMail } from "../service/email.service.js";
import OTP from "../models/otp.model.js";
import axios from "axios";
import GithubConnection from "../models/githubConnection.model.js";
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
    const otp = generateOTP();
    const otpHTML = generateHtmlForOtp(otp);
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpdocument = await OTP.create({ userId: user._id, email, otpHash });
    console.log("reached done");
    const emailResponse = await sendMail(
      email,
      "Your verification code",
      `Your otp is ${otp}`,
      otpHTML,
    );

    return res.status(201).json({
      success: true,
      message: "User registered",
      user: {
        email: user.email,
        username: user.username,
        credits: user.credits,
      },
      emailSent: emailResponse.success,
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
        isVerified: true,
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

export const me = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(402).json({
        success: false,
        message: "Token not found, access denied!",
      });
    }
    const decodedUser = jwt.verify(refreshToken, config.JWT_SECRET);
    if (!decodedUser) {
      return res.status(402).json({
        success: false,
        message: "Invalid token, access denied!",
      });
    }
    console.log("Decoded:\n", decodedUser);

    const user = await User.findById(decodedUser.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await Session.findOne({
      userId: user._id,
      refreshTokenHash,
      revoked: false,
    });
    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Session not found",
      });
    }
    const newRefreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });
    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    const newAccessToken = jwt.sign(
      { id: user._id, sessionId: session._id },
      config.JWT_SECRET,
      { expiresIn: "10m" },
    );
    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000 * 7,
    });

    return res.status(200).json({
      success: true,
      message: "New access generated",
      token: newAccessToken,
      user: {
        email: user.email,
        username: user.username,
        credits: user.credits,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while generating access token",
    });
  }
};

export const otpVerify = async (req, res) => {
  try {
    const { uid } = req.firebaseUser;
    const { otp } = req.body;
    const user = await User.findOne({ firebaseuid: uid });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const otpDoc = await OTP.findOne({
      $and: [{ userId: user._id }, { isUsed: false }],
    });
    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: "No OTP to verify",
      });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const isValidOTP = otpHash === otpDoc.otpHash;
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    otpDoc.isUsed = true;
    await otpDoc.save();

    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User email verified",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const connectGithub = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.redirect(
        "http://localhost:5173/dashboard/git_connect_error?reason=user_not_logged_in",
      );
    }

    const decodedUser = jwt.verify(refreshToken, config.JWT_SECRET);

    const user = await User.findById(decodedUser.id);

    if (!user) {
      return res.redirect(
        "http://localhost:5173/dashboard/git_connect_error?reason=invalid_user",
      );
    }

    if (user.gitConnected) {
      return res.redirect(
        "http://localhost:5173/dashboard?reason=github_already_connected",
      );
    }

    const { code } = req.query;

    if (!code) {
      return res.redirect(
        "http://localhost:5173/dashboard/git_connect_error?reason=missing_code",
      );
    }

    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: config.GITHUB_CLIENT_ID,
        client_secret: config.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    const { access_token: accessToken, refresh_token: githubRefreshToken } =
      tokenResponse.data;

    if (!accessToken) {
      return res.redirect(
        "http://localhost:5173/dashboard/git_connect_error?reason=token_failed",
      );
    }

    const gitUserResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const gitUser = gitUserResponse.data;

    // Important: githubRefreshToken may not exist
    if (!githubRefreshToken) {
      return res.redirect(
        "http://localhost:5173/dashboard/git_connect_error?reason=missing_refresh_token",
      );
    }

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(githubRefreshToken)
      .digest("hex");

    await GithubConnection.create({
      userId: user._id,
      githubId: gitUser.id,
      refreshTokenHash,
    });

    user.gitProfile = gitUser.html_url;
    user.gitConnected = true;

    await user.save();

    return res.redirect("http://localhost:5173/dashboard");
  } catch (error) {
    console.error(
      "GitHub connection error:",
      error.response?.data || error.message,
    );

    return res.redirect(
      "http://localhost:5173/dashboard/git_connect_error?reason=server_error",
    );
  }
};

export const logout = async (req, res) => {};
