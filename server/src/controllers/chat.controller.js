import Conversation from "../models/conversations.model.js";
import redisClient from "../config/redisClient.js";
export const getConversation = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat code not found",
      });
    }

    const conversation = await Conversation.findOne({
      userId: user._id,
      chatCode: chatId,
    }).select("-_id -__v -createdAt -updatedAt -repositoryId -userId");

    if (!conversation) {
      return res.status(400).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation found",
      conversation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching chat",
      error,
    });
  }
};

export const allConversations = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const cacheKey = `rag:chats:${user._id}`;
    const cachedValue = await redisClient.get(cacheKey);
    if (cachedValue) {
      return res.status(200).json({
        success: true,
        message: "Chats cached",
        conversations: JSON.parse(cachedValue),
      });
    }

    const convo = await Conversation.find({
      userId: user._id,
    }).select("title chatCode githubRepoId messages");

    if (convo.length === 0) {
      return res.status(400).json({
        success: false,
        message: "no conversations started yet",
      });
    }
    await redisClient.set(cacheKey, JSON.stringify(convo));

    return res.status(200).json({
      success: true,
      message: "All chats retrieved",
      conversations: convo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching chats",
      error,
    });
  }
};
