import Conversation from "../models/conversations.model.js";

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
    });

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
