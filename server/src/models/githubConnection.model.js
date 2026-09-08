import mongoose from "mongoose";
const githubConnectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    githubId: { type: String, required: [true, "Github ID is required"] },
    revoked: { type: Boolean, default: false },
    encryptedRefreshToken: {
      type: String,
      required: [true, "Refresh Token hash is required"],
    },
    iv: {
      type: String,
      required: [true, "IV is required"],
    },
    authTag: {
      type: String,
      required: [true, "Auth Tag is required"],
    },
    refreshTokenExpiresAt: {
      type: Date,
      required: [true, "Refresh Token expiry is required"],
    },
  },
  { timestamps: true },
);

const GithubConnection = mongoose.model(
  "github_connection",
  githubConnectionSchema,
);

export default GithubConnection;
