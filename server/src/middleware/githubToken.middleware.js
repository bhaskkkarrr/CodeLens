import config from "../config/config.js";
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
    const isConnected = user.gitConnected;
    if (!isConnected) {
      return res.status(400).json({
        success: false,
        message: "Github not connected",
      });
    }

    const userId = user._id;
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
    console.log("Refresh Token", refreshToken);

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
    console.log("Data", response.data);

    if (!response.data.refresh_token || !response.data.access_token) {
      return res
        .status(400)
        .json({ success: false, message: "Token not given by github" });
    }
    const encryption = symmetricEncryption(response.data.refresh_token);
    console.log("encrypt", encryption);
    console.log("githubConnection", githubConnection);
    githubConnection.encryptedRefreshToken = encryption.encryptedData;
    githubConnection.iv = encryption.iv;
    githubConnection.authTag = encryption.authTag;
    console.log("started");
    await githubConnection.save();
    console.log("enbded");
    req.githubAccessToken = response.data.access_token;
    console.log("acess", req.githubAccessToken);
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "github middleware server error",
      error,
    });
  }
};
