import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary.js";
import AuthIdentity from "../models/authIdentity.model.js";

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

export const authenticateUser = async (req, res) => {
  const { email, password, username, authProvider, profileUrl, gitProfile } =
    req.body;
  try {
    let user = await User.findOne({ email });
    // Login
    if (user) {
      // EMAIL/PASSWORD LOGIN
      if (password) {
        const hashedPassword = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");

        const isValidPassword = hashedPassword == user.password;

        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            message: "Incorrect credentials",
          });
        }
        const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
          expiresIn: "7d",
        });

        const refreshTokenHash = crypto
          .createHash("sha256")
          .update(refreshToken)
          .digest("hex");

        try {
          const newSession = await Session.create({
            userId: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
          });
          const accessToken = jwt.sign(
            { id: user._id, sessionId: newSession._id },
            config.JWT_SECRET,
            {
              expiresIn: "10m",
            },
          );
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000 * 7,
          });

          return res.status(201).json({
            success: true,
            message: "User loggedIn",
            user,
            token: accessToken,
            session: newSession,
          });
        } catch (error) {
          throw new Error("Error while creating new session");
        }
      }
      // GOOGLE/GITHUB LOGIN
      if (authProvider) {
        const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
          expiresIn: "7d",
        });

        const refreshTokenHash = crypto
          .createHash("sha256")
          .update(refreshToken)
          .digest("hex");

        const newSession = await Session.create({
          userId: user._id,
          refreshTokenHash,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        });

        const accessToken = jwt.sign(
          { id: user._id, sessionId: newSession._id },
          config.JWT_SECRET,
          {
            expiresIn: "10m",
          },
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000 * 7,
        });

        return res.status(201).json({
          success: true,
          message: "User loggedIn",
          user,
          token: accessToken,
          session: newSession,
        });
      }
    } else {
      // SIGN UP
      // EMAIL/PASSWORD SIGNUP
      if (password) {
        const hashedPassword = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");

        console.log(email.split("@")[0]);
        try {
          const newUser = await User.create({
            email,
            password: hashedPassword,
            username: email.split("@")[0],
            authProvider: "email",
          });

          const refreshToken = jwt.sign(
            { id: newUser._id },
            config.JWT_SECRET,
            {
              expiresIn: "7d",
            },
          );

          const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

          const newSession = await Session.create({
            userId: newUser._id,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            refreshTokenHash,
          });

          const accessToken = jwt.sign(
            { id: newUser._id, sessionId: newSession._id },
            config.JWT_SECRET,
            { expiresIn: "10m" },
          );

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000 * 7,
          });

          return res.status(201).json({
            success: true,
            message: "User created",
            user: newUser,
            token: accessToken,
            session: newSession,
          });
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Error while creating user",
            error,
          });
        }
      } else {
        // GOOGLE/GITHUB SIGNUP
        try {
          let newUser;
          let url = null;
          if (profileUrl) {
            console.log("url", profileUrl);
            console.log("Cloudinary");
            console.log(
              config.CLOUD_NAME,
              config.CLOUDINARY_API_KEY,
              config.CLOUDINARY_SECRET_KEY,
            );
            try {
              const cloudinaryResponse = await cloudinary.uploader.upload(
                profileUrl,
                {
                  folder: "CodeLens_Users",
                },
              );
              console.log(cloudinaryResponse);
              url = cloudinaryResponse.secure_url;
            } catch (error) {
              return res.status(403).json({
                success: false,
                error,
              });
            }
          }
          if (authProvider == "github.com") {
            newUser = await User.create({
              email,
              username,
              authProvider,
              gitProfile,
              profileUrl: url,
            });
          }
          if (authProvider == "google.com") {
            newUser = await User.create({
              email,
              username,
              authProvider,
              isVerified: true,
              profileUrl: url,
            });
          }

          const refreshToken = jwt.sign(
            { id: newUser._id },
            config.JWT_SECRET,
            {
              expiresIn: "7d",
            },
          );

          const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

          const newSession = await Session.create({
            userId: newUser._id,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            refreshTokenHash,
          });

          const accessToken = jwt.sign(
            { id: newUser._id, sessionId: newSession._id },
            config.JWT_SECRET,
            { expiresIn: "10m" },
          );

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000 * 7,
          });

          return res.status(201).json({
            success: true,
            message: "User created",
            user: newUser,
            token: accessToken,
            session: newSession,
          });
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Error while creating user",
            error,
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

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
  console.log("Google", req);
  // const { email, username, profileUrl } = req.body;
  // const user = await User.findOne({ email });
  // if (!user) {
  //   if (!email) {
  //     return res
  //       .status(400)
  //       .json({ success: false, message: "Email is required" });
  //   }
  //   const newUser = await User.create({
  //     email,
  //     username,
  //     profileUrl,
  //     isVerified: true,
  //   });
  // }
};
export const me = async (req, res) => {};
export const logout = async (req, res) => {};
