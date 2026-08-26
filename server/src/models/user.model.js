import mongoose, { mongo } from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: [true, "Email should be unique"],
      required: [true, "Email is required"],
    },
    username: String,
    password: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileUrl: { type: String, default: null },
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
