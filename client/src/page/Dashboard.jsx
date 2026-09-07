import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { motion } from "motion/react";

import {
  FaGithub,
  FaSearch,
  FaCodeBranch,
  FaLock,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";

import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";

import { GlobalLoader } from "../components/Loaders";

import { useGithub } from "../context/GitHubContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { getAllRepositories, isGettingRepos, repositories } = useGithub();

  const [searchQuery, setSearchQuery] = useState("");

  // Connect GitHub
  const handleGithubConnect = () => {
    window.location.href =
      `https://github.com/login/oauth/authorize?` +
      `scope=user:email+offline_access&` +
      `client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}`;
  };

  // Handle GitHub OAuth errors
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const reason = params.get("reason");

    if (!reason) return;

    const errorMessages = {
      github_already_connected: "GitHub account already connected",
      missing_refresh_token: "Token not found. GitHub was not connected.",
      token_failed: "Invalid token. GitHub was not connected.",
      missing_code: "Authorization code is missing.",
      invalid_user: "Invalid user.",
      user_not_logged_in: "Please login first.",
    };

    toast.error(errorMessages[reason] || "Something went wrong on the server.");

    navigate("/", { replace: true });
  }, [navigate]);

  // Fetch repositories only when GitHub is connected
  useEffect(() => {
    if (user?.gitConnected) {
      getAllRepositories();
    }
  }, [user?.gitConnected]);

  if (!user) {
    return <GlobalLoader />;
  }

  const isGitConnected = user.gitConnected;

  // Search repositories
  const filteredRepositories = repositories?.filter((repo) => {
    const search = searchQuery.toLowerCase();

    return (
      repo.name?.toLowerCase().includes(search) ||
      repo.fullName?.toLowerCase().includes(search) ||
      repo.language?.toLowerCase().includes(search)
    );
  });

  // Handle repository analysis
  const handleAnalyzeRepository = (repo) => {
    console.log("Selected repository:", repo);

    /*
      You can later navigate to an analysis page:

      navigate(`/repository/${repo.id}`);

      Or call your repository import/analyze API here.
    */
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto px-4 py-8 md:px-8 lg:px-12">
      {/* GitHub Not Connected */}
      {!isGitConnected ? (
        <div className="flex min-h-full items-center justify-center">
          <div className="flex max-w-md flex-col items-center space-y-6 rounded-2xl border border-hunter-green-200/40 bg-hunter-green-950/20 p-8 text-center shadow-lg shadow-hunter-green-900/20 md:p-12">
            <div className="rounded-2xl bg-hunter-green-600/15 p-5 text-hunter-green-400">
              <FaGithub size={45} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-norway-50">
                Connect your GitHub
              </h1>

              <p className="mt-3 text-gray-400">
                Connect your GitHub account to explore repositories, analyze
                code, and chat with your codebase.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleGithubConnect}
              className="flex items-center gap-3 rounded-xl bg-hunter-green-600 px-5 py-3 font-mono text-norway-50 transition-colors hover:bg-hunter-green-500"
            >
              <FaGithub size={20} />
              Connect GitHub
            </motion.button>
          </div>
        </div>
      ) : isGettingRepos ? (
        /* Loading */
        <div className="flex h-full items-center justify-center">
          <GlobalLoader />
        </div>
      ) : (
        /* Repository Dashboard */
        <div className="mx-auto w-full max-w-6xl">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-mono text-sm text-hunter-green-900/70">
                Welcome back, {user.username}
              </p>

              <h1 className="text-3xl font-semibold text-norway-900 md:text-4xl">
                Your repositories
              </h1>

              <p className="mt-3 max-w-xl text-hunter-green-900/70">
                Select a repository to analyze its codebase and start asking
                questions.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-full border border-hunter-green-400/20 bg-norway-200 px-4 py-2 text-sm text-hunter-green-900 md:self-auto">
              <span className="h-2 w-2 rounded-full bg-hunter-green-400" />
              GitHub Connected
            </div>
          </div>

          {/* Repository Count */}
          <div className="mb-5">
            <p className="text-sm text-hunter-green-900/70">
              {repositories?.length || 0} repositories found
            </p>
          </div>

          {/* Repository Cards */}
          <div className="flex flex-col gap-4 pb-10">
            {repositories?.length > 0 ? (
              repositories.map((repo) => (
                <motion.div
                  key={repo.id}
                  whileHover={{ y: -2 }}
                  className="group rounded-2xl border border-hunter-green-400/15 bg-hunter-green-200 p-5 transition-all hover:border-hunter-green-400 hover:shadow-lg hover:shadow-hunter-green-400"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    {/* Repository Information */}
                    <div className="flex min-w-0 items-start gap-4">
                      {/* Icon */}
                      <div className="shrink-0 rounded-xl bg-hunter-green-600/15 p-3 text-hunter-green-400">
                        <FaGithub size={22} />
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-medium text-norway-900 md:text-xl">
                          {repo.name}
                        </h2>

                        <p className="mt-1 truncate text-sm text-gray-500">
                          {repo.fullName}
                        </p>

                        {/* Metadata */}
                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-400">
                          {/* Language */}
                          {repo.language && (
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-hunter-green-400" />

                              {repo.language}
                            </div>
                          )}

                          {/* Default Branch */}
                          <div className="flex items-center gap-2">
                            <FaCodeBranch />

                            {repo.defaultBranch}
                          </div>

                          {/* Visibility */}
                          <div className="flex items-center gap-2">
                            {repo.isPrivate ? <FaLock /> : <FaGlobe />}

                            {repo.isPrivate ? "Private" : "Public"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analyze Button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleAnalyzeRepository(repo)}
                      className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-hunter-green-600 px-5 py-3 text-sm font-medium text-norway-50 transition-colors hover:bg-hunter-green-500"
                    >
                      Analyze
                      <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              /* Empty Search State */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-hunter-green-400/10 py-20 text-center">
                <FaGithub size={40} className="mb-5 text-hunter-green-400/50" />

                <h2 className="text-xl text-norway-50">
                  No repositories found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try searching for a different repository or language.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
