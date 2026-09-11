import mongoose from "mongoose";
const repoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserId is required"],
    },
    githubRepoId: {
      type: String,
      required: [true, "Repository ID is required"],
    },
    githubOwner: String,
    githubName: String,
    isCloned: {
      type: Boolean,
      default: false,
    },
    githubRepoUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const RepositoryModel = mongoose.model("Repositories", repoSchema);
export default RepositoryModel;
