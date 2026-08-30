import mongoose from "mongoose";
const authIdentitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    provider: { type: String, enum: ["email", "google.com", "github.com"] },
    providerId: String,
    uid: String,
    passwordHash: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const AuthIdentity = mongoose.model("authIdentity", authIdentitySchema);
export default AuthIdentity;
