import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserId is required"],
    },
    refreshTokenHash: {
      type: String,
      required: [true, "Refresh token hash is reqquired"],
    },
    ip: {
      type: String,
      required: [true, "IP Address is reqquired"],
    },
    userAgent: {
      type: String,
      required: [true, "User agent is required"],
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Session = mongoose.model("sessions", sessionSchema);
export default Session;
