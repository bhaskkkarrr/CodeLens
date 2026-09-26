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

    const cacheKey = `rag:${user._id}:${chatId}`;
    const cachedValue = await redisClient.get(cacheKey);
    if (cachedValue) {
      console.log("Chat returned from cache");
      return res.status(200).json({
        success: true,
        message: "Conversation  found",
        conversation: JSON.parse(cachedValue),
      });
    }

    const conversation = await Conversation.findOne({
      userId: user._id,
      chatCode: chatId,
    }).select("-_id -__v -createdAt -updatedAt -repositoryId -userId");

    if (!conversation) {
      await redisClient.del(cacheKey);
      return res.status(400).json({
        success: false,
        message: "Conversation not found",
      });
    }
    await redisClient.set(cacheKey, JSON.stringify(conversation));

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
    const cacheKey = `chats:${user._id}`;
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
    }).select("title chatCode githubRepoId");

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
