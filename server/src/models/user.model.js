import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    firebaseuid: {
      type: String,
      required: [true, "UID is required"],
    },
    email: {
      type: String,
      unique: [true, "Email should be unique"],
      required: [true, "Email is required"],
    },
    username: String,
    password: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePic: { type: String, default: null },
    gitProfile: { type: String, default: null },
    credits: {
      type: Number,
      default: 200,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("users", userSchema);
export default User;
