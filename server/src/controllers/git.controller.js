import axios from "axios";
import fs from "fs/promises";
import path from "path";
import redisClient from "../config/redisClient.js";
import simpleGit from "simple-git";
import RepositoryModel from "../models/githubRepository.model.js";
import config from "../config/config.js";
import Conversation from "../models/conversations.model.js";
export const getAllRepositories = async (req, res) => {
  const access_token = req.githubAccessToken;

  try {
    const cacheKey = `github:repositories:${req.user._id}`;
    const cacheValue = await redisClient.get(cacheKey);
    if (cacheValue) {
      console.log("Returned response from cache");
      return res.status(200).json({
        success: true,
        repositories: JSON.parse(cacheValue),
      });
    }
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const repositories = response.data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      isPrivate: repo.private,
      defaultBranch: repo.default_branch,
      htmlUrl: repo.html_url,
      url: repo.url,
      language: repo.language,
      updatedAt: repo.updated_at,

      owner: {
        login: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
      },
    }));
    await redisClient.set(cacheKey, JSON.stringify(repositories));
    return res.status(200).json({
      success: true,
      repositories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "get all repositories server error",
      error,
    });
  }
};

export const cloneRepository = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const repoId = req.body.repoId;
    if (!repoId) {
      return res.status(400).json({
        success: false,
        message: "Repository ID is required",
      });
    }

    const repo = await RepositoryModel.findOne({
      userId: user._id,
      githubRepoId: repoId,
    });

    if (repo) {
      let conversation = await Conversation.findOne({
        userId: user._id,
        repositoryId: repo._id,
      });

      if (!conversation) {
        conversation = await Conversation.create({
          userId: user._id,
          repositoryId: repo._id,
          chatCode: crypto.randomUUID(),
          title: repo.githubName,
          githubRepoId: repo.githubRepoId,
          messages: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "Repository already cloned",
        repoId: repo.githubRepoId,
        conversation,
      });
    }

    const githubAccessToken = req.githubAccessToken;
    if (!githubAccessToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    const repository = await axios.get(
      `https://api.github.com/repositories/${repoId}`,
      {
        headers: { Authorization: `Bearer ${githubAccessToken}` },
      },
    );

    console.log("Repository", repository.data);

    const repoURL = repository.data.clone_url;
    if (!repoURL) {
      return res.status(404).json({
        success: false,
        message: "Repository url not found",
      });
    }
    const git = simpleGit();

    const localPath = path.resolve(
      process.cwd(),
      "../runtime_data",
      "cloned_repositories",
      user._id.toString(),
      `${repository.data.name}-${Date.now()}`,
    );

    try {
      console.log("PATH:", localPath);

      // 1. Clone repository
      await git.clone(repoURL, localPath);

      console.log("Repository cloned successfully");

      // 2. Send repository to FastAPI for indexing
      const aiResponse = await axios.post(
        `${config.AI_API}/ai/repository/load`,
        {
          repositoryPath: localPath,
          repo_id: repoId.toString(),
          user_id: user._id.toString(),
        },
      );

      console.log("AI:", aiResponse.data);

      if (!aiResponse.data.success) {
        return res.status(400).json({
          success: false,
          message: "Repository cannot be processed",
        });
      }
    } catch (error) {
      console.log("REPOSITORY PROCESSING ERROR:", error.message);

      console.log(
        "PYTHON ERROR:",
        JSON.stringify(error.response?.data, null, 2),
      );

      return res.status(502).json({
        success: false,
        message: "Repository processing error",
        error: error.message,
      });
    } finally {
      // ALWAYS delete temporary repository
      try {
        await fs.rm(localPath, {
          recursive: true,
          force: true,
        });

        console.log("Temporary repository deleted:", localPath);
      } catch (deleteError) {
        console.error(
          "Error while deleting cloned repository:",
          deleteError.message,
        );
      }
    }

    const newRepoClone = await RepositoryModel.create({
      userId: user._id,
      githubRepoId: repository.data.id,
      githubOwner: repository.data.owner.login,
      githubName: repository.data.name,
      isCloned: true,
      githubRepoUrl: repository.data.url,
    });

    if (!newRepoClone) {
      return res.status(400).json({
        success: false,
        message: "Repository clone error ",
      });
    }
    
    const chatcode = crypto.randomUUID();
    const newConversation = await Conversation.create({
      userId: user._id,
      repositoryId: newRepoClone._id,
      chatCode: chatcode,
      title: newRepoClone.githubName,
      githubRepoId: newRepoClone.githubRepoId,
      messages: [],
    });

    if (!newConversation) {
      return res.status(400).json({
        success: false,
        message: "New conversation cannot be created",
      });
    }

    const savingConversation = {
      title: newConversation.title,
      chatCode: newConversation.chatCode,
      githubRepoId: newConversation.githubRepoId,
      messages: newConversation.messages,
    };



    const oldChats = await redisClient.get(`chats:${user._id}`);
    const chats = oldChats ? JSON.parse(oldChats) : [];
    chats.push(savingConversation);
    await redisClient.set(`chats:${user._id}`, JSON.stringify(chats));

    return res.status(200).json({
      success: true,
      message: "Repository cloned successfully ",
      repoId: newRepoClone.githubRepoId,
      conversation: newConversation,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Server error while cloning repository",
    });
  }
};
