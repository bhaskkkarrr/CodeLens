import axios from "axios";
import redisClient from "../config/redisClient.js";
import simpleGit from "simple-git";
import RepositoryModel from "../models/githubRepository.model.js";
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

    const repo = await RepositoryModel.findOne({
      userId: user._id,
      githubRepoId: repoId,
    });
    if (repo) {
      return res.status(200).json({
        success: true,
        message: "Repository already cloned",
        repoId: repo.githubRepoId,
      });
    }

    const githubAccessToken = req.githubAccessToken;
    if (!githubAccessToken) {
      return res.status(400).json({
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
      return res.status(400).json({
        success: false,
        message: "Repository url not found",
      });
    }
    const git = simpleGit();

    const localPath = `../../cloned_repositories/${user._id.toString().slice(0, 7)}/${repository.data.name.toString() + Date.now()}`;

    try {
      await git.clone(repoURL, localPath);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Repository cloned error ",
        error,
      });
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
    return res.status(200).json({
      success: true,
      message: "Repository cloned successfully ",
      repoId: newRepoClone.githubRepoId,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Server error while cloning repository",
    });
  }
};
