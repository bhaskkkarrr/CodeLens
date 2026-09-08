import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import {
  FaUser,
  FaGithub,
  FaShieldHalved,
  FaTrash,
  FaChevronRight,
  FaCheck,
} from "react-icons/fa6";
import { config } from "../config/config.js";
import { useNavigate } from "react-router";
import { BiLoader } from "react-icons/bi";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("account");
  const { user, githubDisconnect, isDisconnecting } = useAuth();
  const navigate = useNavigate();

  const redirectUri = `${config.BACKEND_URL}/api/auth/github-auth`;

  // Connect GitHub
  const handleGithubConnect = () => {
    window.location.href =
      `https://github.com/login/oauth/authorize?` +
      `scope=user:email+offline_access&` +
      `client_id=${config.GITHUB_CLIENT_ID}&` +
      `redirect_uri=${redirectUri}`;
  };

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

  const handleGithubDisconnect = async () => {
    await githubDisconnect();
  };

  const settingsSections = [
    {
      id: "account",
      label: "Account",
      icon: <FaUser />,
    },
    {
      id: "github",
      label: "GitHub",
      icon: <FaGithub />,
    },
    {
      id: "security",
      label: "Security",
      icon: <FaShieldHalved />,
    },
  ];

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto w-full bg-hunter-green-50 px-4 py-6 md:px-8 md:py-10 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <p className="mb-2 font-mono text-sm text-hunter-green-700">
            Manage your CodeLens account
          </p>

          <h1 className="text-3xl font-semibold text-hunter-green-950 md:text-4xl">
            Settings
          </h1>

          <p className="mt-3 text-sm text-hunter-green-700 md:text-base">
            Manage your account, GitHub connection, and preferences.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 lg:shrink-0">
            {/* Mobile Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all ${
                    activeSection === section.id
                      ? "bg-hunter-green-700 text-norway-50 shadow-md"
                      : "border border-hunter-green-300 bg-hunter-green-100 text-hunter-green-800 hover:bg-hunter-green-200"
                  }`}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden rounded-2xl border border-hunter-green-300 bg-hunter-green-100 p-3 shadow-sm lg:block">
              <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-hunter-green-600">
                Settings
              </p>

              <div className="space-y-2">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                      activeSection === section.id
                        ? "bg-hunter-green-700 text-norway-50 shadow-sm"
                        : "text-hunter-green-800 hover:bg-hunter-green-200"
                    }`}
                  >
                    <span className="text-base">{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Settings Content */}
          <main className="min-w-0 flex-1">
            {/* Account Settings */}
            {activeSection === "account" && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="rounded-2xl border border-hunter-green-300 bg-hunter-green-100 p-5 shadow-sm md:p-7">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-hunter-green-950">
                      Account information
                    </h2>

                    <p className="mt-2 text-sm text-hunter-green-700">
                      Update and manage your account details.
                    </p>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-hunter-green-800">
                        Username
                      </label>

                      <input
                        type="text"
                        placeholder="Your username"
                        className="w-full rounded-xl border border-hunter-green-300 bg-hunter-green-50 px-4 py-3 text-hunter-green-950 outline-none transition-colors placeholder:text-hunter-green-500 focus:border-hunter-green-600 focus:ring-2 focus:ring-hunter-green-200"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-hunter-green-800">
                        Email address
                      </label>

                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full rounded-xl border border-hunter-green-300 bg-hunter-green-50 px-4 py-3 text-hunter-green-950 outline-none transition-colors placeholder:text-hunter-green-500 focus:border-hunter-green-600 focus:ring-2 focus:ring-hunter-green-200"
                      />
                    </div>

                    <div className="flex justify-end border-t border-hunter-green-300 pt-5">
                      <button className="rounded-xl bg-hunter-green-700 px-5 py-2.5 text-sm font-medium text-norway-50 transition-colors hover:bg-hunter-green-800">
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-2xl border border-red-300 bg-red-50/40 p-5 shadow-sm md:p-7">
                  <div className="mb-5">
                    <h2 className="text-xl font-semibold text-red-800">
                      Danger zone
                    </h2>

                    <p className="mt-2 text-sm text-red-700/70">
                      These actions are permanent and cannot be undone.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-red-900">
                        Delete account
                      </p>

                      <p className="mt-1 text-xs text-red-700/70">
                        Permanently remove your CodeLens account and data.
                      </p>
                    </div>

                    <button className="flex items-center justify-center gap-2 rounded-xl border border-red-400 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100">
                      <FaTrash />
                      Delete account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* GitHub Settings */}
            {activeSection === "github" && (
              <div className="space-y-6">
                {user?.gitConnected ? (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl border border-hunter-green-300 bg-hunter-green-100 p-5 shadow-sm md:p-7"
                  >
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="flex items-center gap-3 text-xl font-semibold text-hunter-green-950">
                          <FaGithub className="text-hunter-green-700" />
                          GitHub connection
                        </h2>

                        <p className="mt-2 text-sm text-hunter-green-700">
                          Manage the GitHub account connected to CodeLens.
                        </p>
                      </div>

                      <div className="flex w-fit items-center gap-2 rounded-full bg-hunter-green-200 px-3 py-1.5 text-xs font-medium text-hunter-green-800">
                        <FaCheck />
                        Connected
                      </div>
                    </div>

                    {/* Connected Account */}
                    <div className="rounded-xl border border-hunter-green-300 bg-hunter-green-50 p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-hunter-green-200 text-hunter-green-800">
                          <FaGithub size={24} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-hunter-green-950">
                            GitHub Account
                          </p>

                          <p className="mt-1 truncate text-sm text-hunter-green-600">
                            Your connected GitHub account
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        className="rounded-xl border border-red-300 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                        onClick={handleGithubDisconnect}
                        disabled={isDisconnecting}
                      >
                        {isDisconnecting ? (
                          <div className="animate-spin">
                            <BiLoader size={15}/>
                          </div>
                        ) : (
                          "Disconnect GitHub"
                        )}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="flex flex-col rounded-2xl border border-hunter-green-300 bg-hunter-green-100 p-6 text-center shadow-lg shadow-hunter-green-900/10 sm:p-8 md:p-10"
                  >
                    <div className="flex md:flex-row flex-col justify-start items-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-hunter-green-200 text-hunter-green-800">
                        <FaGithub size={38} />
                      </div>
                      <div className="flex w-full justify-center items-center flex-col">
                        <h1 className="mt-7 text-2xl font-semibold text-hunter-green-950 md:text-3xl">
                          Connect your GitHub
                        </h1>
                        <p className=" mt-3 max-w-sm text-sm leading-relaxed text-hunter-green-700 md:text-base">
                          Connect your GitHub account to explore your
                          repositories.
                        </p>
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
                )}
              </div>
            )}

            {/* Security */}
            {activeSection === "security" && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="rounded-2xl border border-hunter-green-300 bg-hunter-green-100 p-5 shadow-sm md:p-7">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-hunter-green-950">
                      Security
                    </h2>

                    <p className="mt-2 text-sm text-hunter-green-700">
                      Manage your account security and authentication.
                    </p>
                  </div>

                  <div className="divide-y divide-hunter-green-300">
                    <button className="flex w-full items-center justify-between py-5 text-left first:pt-0">
                      <div>
                        <p className="text-sm font-semibold text-hunter-green-950">
                          Change password
                        </p>

                        <p className="mt-1 text-xs text-hunter-green-600">
                          Update your account password.
                        </p>
                      </div>

                      <FaChevronRight className="text-hunter-green-500" />
                    </button>

                    <button className="flex w-full items-center justify-between py-5 text-left">
                      <div>
                        <p className="text-sm font-semibold text-hunter-green-950">
                          Active sessions
                        </p>

                        <p className="mt-1 text-xs text-hunter-green-600">
                          Manage devices currently signed into your account.
                        </p>
                      </div>

                      <FaChevronRight className="text-hunter-green-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
