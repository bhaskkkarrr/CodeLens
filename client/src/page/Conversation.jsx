import { useState } from "react";
import { motion } from "motion/react";

import {
  FaGithub,
  FaArrowRight,
  FaCodeBranch,
  FaFolderOpen,
  FaComments,
  FaClock,
  FaChartSimple,
  FaRobot,
  FaPaperPlane,
  FaChevronDown,
  FaCircleCheck,
  FaPlus,
} from "react-icons/fa6";

import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useGithub } from "../context/GitHubContext";

const Conversation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedRepository } = useGithub();
  console.log("Selected repo", selectedRepository);
  const [question, setQuestion] = useState("");

  const repositories = [
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
  ];

  const recentQuestions = [
    "How does authentication work?",
    "Explain the project structure",
    "Where is the database configured?",
    "How does the API handle errors?",
    "How does authentication work?",
    "Explain the project structure",
    "Where is the database configured?",
    "How does the API handle errors?",
    "How does authentication work?",
    "Explain the project structure",
    "Where is the database configured?",
    "How does the API handle errors?",
    "How does authentication work?",
    "Explain the project structure",
    "Where is the database configured?",
    "How does the API handle errors?",
  ];

  const handleAsk = () => {
    if (!question.trim()) return;

    // TODO:
    // Send question + selectedRepo to Node backend
    console.log({
      repository: selectedRepo,
      question,
    });

    setQuestion("");
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto bg-hunter-green-50 px-4 py-5 sm:px-6 md:px-8 md:py-8 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <section className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-hunter-green-950 sm:text-3xl">
                What do you want to know?
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-hunter-green-700">
                Ask questions about your repositories and get answers grounded
                about your codebase.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* ============================================== */}
          {/* RAG CHAT */}
          {/* ============================================== */}

          <section className="flex min-h-123 flex-col overflow-hidden rounded-2xl border border-hunter-green-300 bg-hunter-green-100 shadow-sm lg:col-span-2">
            {/* Chat Body */}
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-6">
              {/* Empty / Intro State */}
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-hunter-green-200 text-hunter-green-800">
                  <FaRobot size={24} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-hunter-green-950">
                  Ask anything about {selectedRepository?.name}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-hunter-green-700">
                  CodeLens uses your repository's code as context to answer
                  questions about implementation, functions, files and project
                  structure.
                </p>

                {/* Suggested Questions */}
                <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    "How does authentication work?",
                    "Explain the project structure",
                    "Where is the database configured?",
                    "How does the API handle errors?",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuestion(suggestion)}
                      className="rounded-xl border border-hunter-green-300 bg-hunter-green-50 px-4 py-3 text-left text-sm text-hunter-green-800 transition hover:border-hunter-green-500 hover:bg-hunter-green-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t border-hunter-green-300 bg-hunter-green-100 p-3 ">
              <div className="flex items-end gap-2 rounded-2xl border border-hunter-green-300 bg-hunter-green-50 p-2 transition focus-within:border-hunter-green-600 focus-within:ring-2 focus-within:ring-hunter-green-200">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  rows={1}
                  placeholder={`Ask about ${selectedRepository?.name}...`}
                  className="max-h-32 min-h-10.5 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-hunter-green-950 outline-none placeholder:text-hunter-green-500"
                />

                <button
                  onClick={handleAsk}
                  disabled={!question.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-hunter-green-800 text-white transition hover:bg-hunter-green-950 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send question"
                >
                  <FaPaperPlane size={14} />
                </button>
              </div>

              <p className="mt-2 text-center text-[11px] text-hunter-green-600">
                CodeLens AI can make mistakes. Verify important answers against
                your source code.
              </p>
            </div>
          </section>

          <aside className="space-y-6">
            {/* Recent Questions */}
            <section className="rounded-2xl max-h-123 overflow-y-auto border border-hunter-green-300 bg-hunter-green-100 p-5 shadow-sm md:p-6">
              <h2 className="text-lg font-semibold text-hunter-green-950">
                Recent Questions
              </h2>

              <div className="mt-4 space-y-2">
                {recentQuestions.map((question, idx) => {
                  return (
                    <div className="flex" key={idx}>
                      {idx + 1}) {question}
                    </div>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
