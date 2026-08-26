import mongoose from "mongoose";

const authIdentitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    provider: String,
    providerId: String,
  },
  { timestamps: true },
);

const AuthIdentity = mongoose.model("authIdentity", authIdentitySchema);
export default AuthIdentity;
