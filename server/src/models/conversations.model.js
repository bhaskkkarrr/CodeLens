import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is required"],
    trim: true,
  },

  answer: {
    type: String,
    required: [true, "Answer is required"],
    trim: true,
  },
});

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RepositoryModel",
      required: [true, "Repository Id is required"],
    },
    title: {
      type: String,
      default: "New Conversation",
    },
    githubRepoId: {
      type: String,
      required: [true, "Github repository Id is requried"],
    },
    chatCode: {
      type: String,
      required: [true, "Chat code is required"],
      unique: [true, "Chat code should be required"],
    },
    messages: [messageSchema],
  },
  { timestamps: true },
);

const Conversation = mongoose.model("conversations", conversationSchema);
export default Conversation;
