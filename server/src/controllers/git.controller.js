import axios from "axios";
import redisClient from "../config/redisClient.js";
export const getAllRepositories = async (req, res) => {
  const access_token = req.githubAccessToken;
  console.log("access:", req.githubAccessToken);

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
