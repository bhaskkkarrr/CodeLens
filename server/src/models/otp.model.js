import mongoose from "mongoose";
const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserId is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    otpHash: {
      type: String,
      required: [true, "OTP hash is required"],
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const OTP = mongoose.model("otps", otpSchema);
export default OTP;
