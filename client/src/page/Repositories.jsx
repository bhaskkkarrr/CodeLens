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
  FaTimes,
} from "react-icons/fa";

import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";

import { GlobalLoader, RepoLoader } from "../components/Loaders";

import { useGithub } from "../context/GitHubContext";

import { config } from "../config/config";

const Repositories = () => {
  const navigate = useNavigate();

  const { user, token } = useAuth();

  const { getAllRepositories, isGettingRepos, repositories } = useGithub();

  const [searchQuery, setSearchQuery] = useState("");

  const redirectUri = `${config.BACKEND_URL}/api/auth/github-auth`;

  // Connect GitHub
  const handleGithubConnect = () => {
    window.location.href =
      `https://github.com/login/oauth/authorize?` +
      `scope=user:email+offline_access&` +
      `client_id=${config.GITHUB_CLIENT_ID}&` +
      `redirect_uri=${redirectUri}`;
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

    navigate("/", {
      replace: true,
    });
  }, [navigate]);

  // Fetch repositories
  useEffect(() => {
    if (user?.gitConnected) {
      getAllRepositories();
    }
  }, [user?.gitConnected]);

  if (!user) {
    return <GlobalLoader />;
  }
  const isGitConnected = user.gitConnected;

  // Filter repositories
  const filteredRepositories =
    repositories?.filter((repo) => {
      const search = searchQuery.toLowerCase().trim();

      if (!search) return true;

      return (
        repo.name?.toLowerCase().includes(search) ||
        repo.fullName?.toLowerCase().includes(search) ||
        repo.language?.toLowerCase().includes(search)
      );
    }) || [];

  // Handle repository import
  const handleAnalyzeRepository = (repo) => {
    console.log("Selected repository:", repo);

    /*
      Later:

      navigate(`/repository/${repo.id}`);

      Or call your import API here.
    */
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto w-full bg-hunter-green-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-12"
      >
        {/* ============================= */}
        {/* GITHUB NOT CONNECTED */}
        {/* ============================= */}

        {!isGitConnected ? (
          <div className="flex min-h-[calc(100vh-128px)] items-center justify-center">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="w-full max-w-md rounded-2xl border border-hunter-green-300 bg-hunter-green-100 p-6 text-center shadow-lg shadow-hunter-green-900/10 sm:p-8 md:p-10"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-hunter-green-200 text-hunter-green-800">
                <FaGithub size={38} />
              </div>

              <h1 className="mt-7 text-2xl font-semibold text-hunter-green-950 md:text-3xl">
                Connect your GitHub
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-hunter-green-700 md:text-base">
                Connect your GitHub account to explore your repositories, import
                codebases, and start asking questions about your code.
              </p>

              <div className="mt-5 space-y-2 text-left">
                <div className="rounded-xl border border-hunter-green-300 bg-hunter-green-50 px-4 py-3 text-sm text-hunter-green-800">
                  Import repositories for analysis
                </div>

                <div className="rounded-xl border border-hunter-green-300 bg-hunter-green-50 px-4 py-3 text-sm text-hunter-green-800">
                  Chat with your codebase
                </div>
              </div>

              <motion.button
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={handleGithubConnect}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-hunter-green-700 px-5 py-3.5 text-sm font-medium text-norway-50 shadow-md transition-colors hover:bg-hunter-green-800"
              >
                <FaGithub size={20} />
                Connect GitHub
              </motion.button>
            </motion.div>
          </div>
        ) : isGettingRepos ? (
          <div className="flex min-h-[calc(100vh-128px)] items-center justify-center">
            <RepoLoader />
          </div>
        ) : (
          <div>
            <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-wider text-hunter-green-600 sm:text-sm">
                  GitHub workspace
                </p>

                <h1 className="text-3xl font-semibold text-hunter-green-950 sm:text-4xl">
                  Your repositories
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-hunter-green-700 md:text-base">
                  Select a repository to import its codebase and start exploring
                  it with CodeLens.
                </p>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-full border border-hunter-green-300 bg-hunter-green-100 px-4 py-2 text-sm font-medium text-hunter-green-800">
                <span className="h-2 w-2 rounded-full bg-hunter-green-600" />
                GitHub Connected
              </div>
            </div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-hunter-green-600" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search repositories..."
                  className="w-full rounded-xl border border-hunter-green-300 bg-hunter-green-100 py-3 pl-11 pr-11 text-sm text-hunter-green-950 outline-none transition-all placeholder:text-hunter-green-500 focus:border-hunter-green-600 focus:ring-2 focus:ring-hunter-green-200"
                />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-hunter-green-600 transition-colors hover:bg-hunter-green-200 hover:text-hunter-green-900"
                  >
                    <FaTimes size={13} />
                  </button>
                )}
              </div>

              <p className="shrink-0 text-sm text-hunter-green-700">
                <span className="font-semibold text-hunter-green-950">
                  {filteredRepositories.length}
                </span>{" "}
                {filteredRepositories.length === 1
                  ? "repository"
                  : "repositories"}
              </p>
            </div>

            {filteredRepositories.length > 0 ? (
              <div className="flex flex-col gap-4 pb-8">
                {filteredRepositories.map((repo, idx) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{
                      y: -3,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 * idx,
                    }}
                    className="group rounded-2xl border border-hunter-green-300 bg-hunter-green-100 p-4 shadow-sm hover:border-hunter-green-500 hover:shadow-lg hover:shadow-hunter-green-900/10 sm:p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      {/* Repository Information */}

                      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                        {/* GitHub Icon */}

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-hunter-green-200 text-hunter-green-800 sm:h-12 sm:w-12">
                          <FaGithub size={21} />
                        </div>

                        {/* Repository Details */}

                        <div className="min-w-0 flex-1">
                          <h2 className="truncate text-base font-semibold text-hunter-green-950 sm:text-lg md:text-xl">
                            {repo.name}
                          </h2>

                          <p className="mt-1 truncate text-xs text-hunter-green-600 sm:text-sm">
                            {repo.fullName}
                          </p>

                          {/* Metadata */}

                          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-hunter-green-700 sm:text-sm">
                            {/* Language */}

                            {repo.language && (
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-hunter-green-500" />

                                {repo.language}
                              </div>
                            )}

                            {/* Branch */}

                            {repo.defaultBranch && (
                              <div className="flex items-center gap-2">
                                <FaCodeBranch />

                                <span className="max-w-32 truncate">
                                  {repo.defaultBranch}
                                </span>
                              </div>
                            )}

                            {/* Visibility */}

                            <div className="flex items-center gap-2">
                              {repo.isPrivate ? <FaLock /> : <FaGlobe />}

                              {repo.isPrivate ? "Private" : "Public"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Import Button */}

                      <motion.button
                        whileHover={{
                          scale: 1.03,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={() => handleAnalyzeRepository(repo)}
                        className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-hunter-green-700 px-5 py-3 text-sm font-medium text-norway-50 transition-colors hover:bg-hunter-green-800 sm:w-auto"
                      >
                        Import
                        <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* ============================= */
              /* EMPTY SEARCH STATE */
              /* ============================= */

              <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-hunter-green-300 bg-hunter-green-100 px-6 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-hunter-green-200 text-hunter-green-600">
                  <FaSearch size={24} />
                </div>

                <h2 className="mt-6 text-xl font-semibold text-hunter-green-950">
                  No repositories found
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-relaxed text-hunter-green-700">
                  {searchQuery
                    ? `We couldn't find a repository matching "${searchQuery}".`
                    : "No repositories are currently available in your GitHub account."}
                </p>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-5 rounded-xl border border-hunter-green-300 bg-hunter-green-50 px-4 py-2.5 text-sm font-medium text-hunter-green-800 transition-colors hover:bg-hunter-green-200"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Repositories;
