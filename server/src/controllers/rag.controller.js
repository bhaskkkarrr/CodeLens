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

  const cacheKey = `rag:${user._id}:${chatCode}}`;
  const cacheValue = await redisClient.get(cacheKey);
  if (cacheValue) {
    const parsedCache = JSON.parse(cacheValue);
    return res.status(200).json({
      success: true,
      message: "Response cached ",
      response: parsedCache,
    });
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

    let conversation = await Conversation.findOne({
      userId: user._id,
      githubRepoId: repoId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        userId: user._id,
        repositoryId: repoId,
        chatCode: crypto.randomUUID(),
        title: repo.githubName,
        githubRepoId: repo.githubRepoId,
        messages: [],
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
      const cachedChats = await redisClient.get(cacheKey);
      const chats = cachedChats ? JSON.parse(cachedChats) : [];

      const chat = chats.find(
        (chat) => chat.chatCode === conversation.chatCode,
      );

      if (chat) {
        chat.messages.push({
          question: query,
          answer: response_data.answer,
          sources: response_data?.source,
        });
      }

      await redisClient.set(redisKey, JSON.stringify(chats));

      conversation.messages.push({
        question: query,
        answer: response_data.answer,
        sources: response_data?.source,
      });

      await conversation.save();

      return res.status(200).json({
        success: true,
        message: "AI response generated successfully",
        response: response_data.response,
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
