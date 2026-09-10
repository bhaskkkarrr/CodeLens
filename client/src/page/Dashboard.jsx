import { motion } from "motion/react";

import {
  FaGithub,
  FaArrowRight,
  FaCodeBranch,
  FaFolderOpen,
  FaComments,
  FaClock,
  FaPlus,
  FaChartSimple,
} from "react-icons/fa6";

import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto bg-hunter-green-50 px-4 py-6 md:px-8 md:py-10 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        {/* Quick Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-hunter-green-300 bg-hunter-green-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-hunter-green-200 p-3 text-hunter-green-800">
                <FaFolderOpen size={20} />
              </div>

              <span className="text-sm text-hunter-green-600">
                Repositories
              </span>
            </div>

            <p className="mt-5 text-3xl font-semibold text-hunter-green-950">
              12
            </p>

            <p className="mt-1 text-sm text-hunter-green-700">
              Available to explore
            </p>
          </div>

          <div className="rounded-2xl border border-hunter-green-300 bg-hunter-green-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-hunter-green-200 p-3 text-hunter-green-800">
                <FaChartSimple size={20} />
              </div>

              <span className="text-sm text-hunter-green-600">Analyzed</span>
            </div>

            <p className="mt-5 text-3xl font-semibold text-hunter-green-950">
              4
            </p>

            <p className="mt-1 text-sm text-hunter-green-700">
              Codebases analyzed
            </p>
          </div>

          <div className="rounded-2xl border border-hunter-green-300 bg-hunter-green-100 p-5 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-hunter-green-200 p-3 text-hunter-green-800">
                <FaComments size={20} />
              </div>

              <span className="text-sm text-hunter-green-600">Questions</span>
            </div>

            <p className="mt-5 text-3xl font-semibold text-hunter-green-950">
              28
            </p>

            <p className="mt-1 text-sm text-hunter-green-700">
              Questions asked
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Recent Repositories */}
          <section className="rounded-2xl border border-hunter-green-300 bg-hunter-green-100 p-5 shadow-sm md:p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-hunter-green-950">
                  Recent repositories
                </h2>

                <p className="mt-1 text-sm text-hunter-green-700">
                  Continue where you left off.
                </p>
              </div>

              <button
                onClick={() => navigate("/repositories")}
                className="hidden items-center gap-2 text-sm font-medium text-hunter-green-700 hover:text-hunter-green-950 sm:flex"
              >
                View all
                <FaArrowRight />
              </button>
            </div>

            <div className="space-y-3">
              {/* Repository Card */}
              {[
                {
                  name: "CodeLens",
                  language: "JavaScript",
                  status: "Analyzed",
                  time: "Last opened today",
                },
                {
                  name: "E-commerce App",
                  language: "JavaScript",
                  status: "Ready",
                  time: "Opened 2 days ago",
                },
                {
                  name: "Portfolio",
                  language: "React",
                  status: "Analyzed",
                  time: "Opened last week",
                },
              ].map((repo) => (
                <motion.div
                  key={repo.name}
                  whileHover={{ y: -2 }}
                  className="group flex flex-col gap-4 rounded-xl border border-hunter-green-300 bg-hunter-green-50 p-4 transition-all hover:border-hunter-green-500 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-hunter-green-200 text-hunter-green-800">
                      <FaGithub size={20} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-hunter-green-950">
                        {repo.name}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-hunter-green-600">
                        <span>{repo.language}</span>

                        <span className="h-1 w-1 rounded-full bg-hunter-green-400" />

                        <span>{repo.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span className="rounded-full bg-hunter-green-200 px-3 py-1 text-xs font-medium text-hunter-green-800">
                      {repo.status}
                    </span>

                    <button className="flex items-center gap-2 text-sm font-medium text-hunter-green-800 hover:text-hunter-green-950">
                      Open
                      <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => navigate("/dashboard/repositories")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-hunter-green-300 py-3 text-sm font-medium text-hunter-green-800 transition-colors hover:bg-hunter-green-200 sm:hidden"
            >
              View all repositories
              <FaArrowRight />
            </button>
          </section>

          {/* Right Column */}
          <aside className="space-y-6">
            {/* Quick Actions */}
            <section className="rounded-2xl border border-hunter-green-300 bg-hunter-green-100 p-5 shadow-sm md:p-6">
              <h2 className="text-xl font-semibold text-hunter-green-950">
                Quick actions
              </h2>

              <div className="mt-5 space-y-3">
                <button
                  onClick={() => navigate("/repositories")}
                  className="flex w-full items-center justify-between rounded-xl border border-hunter-green-300 bg-hunter-green-50 p-4 text-left transition-colors hover:bg-hunter-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-hunter-green-200 p-2 text-hunter-green-800">
                      <FaFolderOpen />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-hunter-green-950">
                        Browse repositories
                      </p>

                      <p className="text-xs text-hunter-green-600">
                        Select a codebase
                      </p>
                    </div>
                  </div>

                  <FaArrowRight className="text-hunter-green-600" />
                </button>

                <button className="flex w-full items-center justify-between rounded-xl border border-hunter-green-300 bg-hunter-green-50 p-4 text-left transition-colors hover:bg-hunter-green-200">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-hunter-green-200 p-2 text-hunter-green-800">
                      <FaCodeBranch />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-hunter-green-950">
                        Connect repository
                      </p>

                      <p className="text-xs text-hunter-green-600">
                        Import a new project
                      </p>
                    </div>
                  </div>

                  <FaArrowRight className="text-hunter-green-600" />
                </button>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="rounded-2xl border border-hunter-green-300 bg-hunter-green-100 p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-2">
                <FaClock className="text-hunter-green-700" />

                <h2 className="text-lg font-semibold text-hunter-green-950">
                  Recent activity
                </h2>
              </div>

              <div className="mt-5 space-y-5">
                <div className="border-l-2 border-hunter-green-400 pl-4">
                  <p className="text-sm font-medium text-hunter-green-950">
                    Repository analyzed
                  </p>

                  <p className="mt-1 text-xs text-hunter-green-600">
                    CodeLens • Today
                  </p>
                </div>

                <div className="border-l-2 border-hunter-green-300 pl-4">
                  <p className="text-sm font-medium text-hunter-green-950">
                    Asked a question
                  </p>

                  <p className="mt-1 text-xs text-hunter-green-600">
                    E-commerce App • Yesterday
                  </p>
                </div>

                <div className="border-l-2 border-hunter-green-300 pl-4">
                  <p className="text-sm font-medium text-hunter-green-950">
                    GitHub connected
                  </p>

                  <p className="mt-1 text-xs text-hunter-green-600">
                    Account • 3 days ago
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
