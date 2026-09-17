import config from "../config/config.js";
import axios from "axios";
import RepositoryModel from "../models/githubRepository.model.js";
import redisClient from "../config/redisClient.js";
import { response } from "express";

export const ask_questions = async (req, res) => {
  const query = req.body.query;
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

  const repoId = req.body.repoId;
  if (!repoId) {
    return res.status(400).json({
      success: false,
      message: "Repo id is required",
    });
  }
  const cacheKey = `rag:${user._id}:${repoId}:${query.trim()}`;
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
    const connectedRepos = await RepositoryModel.find({
      userId: user._id,
      githubRepoId: repoId,
    });

    if (connectedRepos.length == 0) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to this repository",
      });
    }
    console.log("ConnectedRepos", connectedRepos);

    const ai_response = await axios.post(`${config.AI_API}/ai/rag/question`, {
      repo_id: repoId,
      question: query,
    });

    const reponse_data = ai_response.data;
    console.log("RES:", reponse_data);
    if (reponse_data.success) {
      await redisClient.set(cacheKey, JSON.stringify(reponse_data.response));
      await redisClient.expire(cacheKey, 300);
      return res.status(200).json({
        success: true,
        message: "AI response generated successfully",
        response: reponse_data.response,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "AI response generation error",
        error: reponse_data.message,
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
