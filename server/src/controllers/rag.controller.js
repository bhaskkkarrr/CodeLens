import config from "../config/config.js";
import axios from "axios";
import RepositoryModel from "../models/githubRepository.model.js";
import Conversation from "../models/conversations.model.js";
import redisClient from "../config/redisClient.js";

export const ask_questions = async (req, res) => {
  const { chatCode, query, repoId } = req.body;
  console.log("Question", query);
  if (!query) {
    return res.status(400).json({
      success: false,
      message: "No question asked",
    });
  }

  const user = req.user;
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "No question asked",
    });
  }

  if (!repoId) {
    return res.status(400).json({
      success: false,
      message: "Repo id is required",
    });
  }

  if (!chatCode) {
    return res.status(400).json({
      success: false,
      message: "Chat code is required",
    });
  }

  const cacheKey = `rag:${user._id}:${chatCode}`;
  const cacheValue = await redisClient.get(cacheKey);
  if (cacheValue) {
    const parsedCache = JSON.parse(cacheValue);
    const messages = parsedCache?.messages;
    if (messages) {
      const message = messages.find((message) => message.question === query);
      if (message) {
        console.log("Answer cached");
        return res.status(200).json({
          success: true,
          message: "Response cached",
          answer: message.answer,
        });
      }
    }
  }

  try {
    const connectedRepos = await RepositoryModel.findOne({
      userId: user._id,
      githubRepoId: repoId,
    });

    if (!connectedRepos) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to this repository",
      });
    }

    console.log("ConnectedRepos", connectedRepos);

    const conversation = await Conversation.findOne({
      userId: user._id,
      githubRepoId: repoId,
      chatCode,
    });

    if (!conversation) {
      return res.status(400).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const ai_response = await axios.post(`${config.AI_API}/ai/rag/question`, {
      repo_id: repoId,
      question: query,
      user_id: user._id,
    });

    const response_data = ai_response.data;

    console.log("RES:", response_data);
    if (response_data.success) {
      conversation.messages.push({
        question: query,
        answer: response_data.answer,
        sources: response_data?.source,
      });

      await conversation.save();
      await redisClient.set(cacheKey, JSON.stringify(conversation));

      return res.status(200).json({
        success: true,
        message: "AI response generated successfully",
        answer: response_data.answer,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "AI response generation error",
        error: response_data.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error occured",
      error,
    });
  }
};
