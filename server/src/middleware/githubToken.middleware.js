import config from "../config/config.js";
import redisClient from "../config/redisClient.js";
import GithubConnection from "../models/githubConnection.model.js";
import { decryption, symmetricEncryption } from "../utils/encryption.js";
import axios from "axios";
export const githubToken = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (!user.gitConnected) {
      return res.status(400).json({
        success: false,
        message: "Github not connected",
      });
    }

    const userId = user._id;

    const cacheKey = `github:access_token:${userId.toString()}`;
    const cachedValue = await redisClient.get(cacheKey);
    if (cachedValue) {
      console.log("Cached Token");
      req.githubAccessToken = cachedValue;
      return next();
    }

    const githubConnection = await GithubConnection.findOne({ userId });
    if (!githubConnection) {
      return res.status(400).json({
        success: false,
        message: "Github not connected",
      });
    }
    console.log("githubConnect", githubConnection);

    const refreshToken = decryption(
      githubConnection.encryptedRefreshToken,
      githubConnection.iv,
      githubConnection.authTag,
    );

    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: config.GITHUB_CLIENT_ID,
        client_secret: config.GITHUB_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.data.refresh_token || !response.data.access_token) {
      return res
        .status(400)
        .json({ success: false, message: "Token not given by github" });
    }

    const encryption = symmetricEncryption(response.data.refresh_token);


    githubConnection.encryptedRefreshToken = encryption.encryptedData;
    githubConnection.iv = encryption.iv;
    githubConnection.authTag = encryption.authTag;
    githubConnection.refreshTokenExpiresAt = new Date(
      Date.now() + response.data.refresh_token_expires_in * 1000,
    );

    await githubConnection.save();

    await redisClient.set(cacheKey, response.data.access_token);
    await redisClient.expire(cacheKey, 22000);
    req.githubAccessToken = response.data.access_token;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "github middleware server error",
      error,
    });
  }
};
