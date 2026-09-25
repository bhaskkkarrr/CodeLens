import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { IoMdSettings, IoMdClose, IoMdMenu } from "react-icons/io";

import { AiFillHome } from "react-icons/ai";
import { GoRepoForked } from "react-icons/go";
import { FaUser, FaChevronUp } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";

import logo from "/icon-remove_bg.png";

import { useLocation, useNavigate } from "react-router";
import { useRAG } from "../context/RAGContext";
import { useAuth } from "../context/AuthContext";

const pages = [
  {
    id: "dashboard",
    name: "Dashboard",
    url: "/dashboard/",
    icon: <AiFillHome />,
  },
  {
    id: "repositories",
    name: "Repositories",
    url: "/dashboard/repositories",
    icon: <GoRepoForked />,
  },
  {
    id: "setting",
    name: "Settings",
    url: "/dashboard/settings",
    icon: <IoMdSettings />,
  },
];

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getAllChats, allChats, selectedChat } = useRAG();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const activePage = pages.find((page) => {
    if (page.id === "dashboard") {
      return (
        location.pathname === "/dashboard/" ||
        location.pathname === "/dashboard"
      );
    }

    return location.pathname === page.url;
  });

  const handleNavigation = (url) => {
    navigate(url);
    setIsMobileOpen(false);
  };
  console.log("Chats", allChats);
  useEffect(() => {
    getAllChats();
  }, []);

  const handleLogout = async () => {};

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-norway-700/20 bg-norway-50/95 px-4 shadow-sm backdrop-blur-md lg:hidden">
        {/* Logo */}
        <button
          onClick={() => handleNavigation("/dashboard/")}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-hunter-green-300 p-1">
            <img
              src={logo}
              alt="CodeLens"
              className="h-full w-full object-contain"
            />
          </div>

          <span className="text-lg font-semibold tracking-tight text-norway-800">
            CodeLens
          </span>
        </button>

        {/* Menu button */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open navigation"
          className="flex h-10 w-10 items-center justify-center rounded-2xl text-norway-800 transition-colors hover:bg-hunter-green-200 active:scale-95"
        >
          <IoMdMenu size={24} />
        </button>
      </div>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-norway-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen
          w-[320px] shrink-0
          border-r border-norway-700/20
          bg-linear-to-b from-norway-50 via-norway-50 to-hunter-green-100
          shadow-xl shadow-norway-950/10
          transition-transform duration-300 ease-out
          lg:sticky lg:z-30 lg:block lg:translate-x-0 lg:shadow-none
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex h-full flex-col px-4 py-5 sm:px-5">
          <div className="mb-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleNavigation("/dashboard/")}
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-hunter-green-300 p-1 shadow-sm">
                <img
                  src={logo}
                  alt="CodeLens"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex flex-col items-start">
                <span className="text-xl font-semibold tracking-tight text-norway-900">
                  CodeLens
                </span>

                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-norway-600">
                  Code intelligence
                </span>
              </div>
            </button>

            {/* Mobile close */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-norway-700 transition-colors hover:bg-hunter-green-200 lg:hidden"
            >
              <IoMdClose size={22} />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            {/* Workspace */}
            <nav>
              <div className="mb-3 px-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-norway-600/70">
                  Workspace
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                {pages.map((page) => {
                  const isActive = activePage?.id === page.id;

                  return (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => handleNavigation(page.url)}
                      className={`
                        group flex w-full items-center gap-3
                        rounded-2xl px-3 py-3
                        text-left text-sm font-medium
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-hunter-green-600 text-norway-50 shadow-md shadow-hunter-green-900/10"
                            : "text-norway-800 hover:bg-hunter-green-200/70 hover:text-norway-950"
                        }
                      `}
                    >
                      {/* Icon */}
                      <span
                        className={`
                          flex h-9 w-9 shrink-0 items-center justify-center
                          rounded-xl text-lg
                          transition-colors
                          ${
                            isActive
                              ? "bg-hunter-green-500/50 text-norway-50"
                              : "bg-hunter-green-100 text-hunter-green-700 group-hover:bg-hunter-green-200"
                          }
                        `}
                      >
                        {page.icon}
                      </span>

                      <span className="flex-1 truncate">{page.name}</span>

                      {isActive && (
                        <FiChevronRight
                          size={15}
                          className="shrink-0 opacity-80"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* =================================================
                CONVERSATIONS
            ================================================== */}
            {allChats && (
              <section className="mt-8 flex min-h-0 flex-1 flex-col">
                <div className="mb-3 flex items-center justify-between px-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-norway-600/70">
                    Conversations
                  </p>

                  <span className="rounded-full bg-hunter-green-200 px-2 py-0.5 text-[10px] font-semibold text-hunter-green-800">
                    {allChats?.length || 0}
                  </span>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-hunter-green-500">
                  <div className="flex flex-col gap-1">
                    {allChats.length > 0 &&
                      allChats?.map((chat) => (
                        <button
                          key={chat.chatCode}
                          type="button"
                          onClick={() =>
                            handleNavigation(`/dashboard/c/${chat.chatCode}`)
                          }
                          className="
                        group flex w-full items-center gap-3
                        rounded-xl px-3 py-2.5
                        text-left text-sm
                        text-norway-700
                        transition-all duration-200
                        hover:bg-hunter-green-200/70
                        hover:text-norway-950
                      "
                        >
                          {/* Conversation indicator */}
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full bg-hunter-green-500 transition-all group-hover:h-2 group-hover:w-2 group-hover:opacity-100 ${selectedChat?.githubRepoId === chat?.githubRepoId ? "opacity-100 w-2 h-2" : "opacity-50"}`}
                          />

                          <span className="truncate font-medium">
                            {chat.title}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="mt-5 border-t border-norway-700/15 pt-4">
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-2 overflow-hidden rounded-2xl border border-hunter-green-200 bg-white shadow-lg"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-hunter-green-700 text-hunter-green-100">
                      <FaUser size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-norway-900">
                        {user?.username || "NA"}
                      </p>

                      <p className="truncate text-xs text-norway-600">
                        {user?.email || "No email available"}
                      </p>
                    </div>
                  </div>

                  <div className="my-3 border-t border-norway-700/10" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/dashboard/settings");
                    }}
                    className="flex group w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-norway-700 transition-colors hover:bg-hunter-green-100 hover:text-norway-950"
                  >
                    <IoMdSettings
                      size={17}
                      className="transition-transform duration-300 group-hover:rotate-90"
                    />
                    <span>Account settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="group mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <IoMdClose
                      size={17}
                      className="transition-transform duration-300 group-hover:rotate-90"
                    />
                    <span>Log out</span>
                  </button>
                </div>
              </motion.div>
            )}
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="group flex w-full items-center gap-3 rounded-2xl p-2 transition-all duration-200 hover:bg-hunter-green-200/60"
            >
              {/* Avatar */}
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-hunter-green-700
                  text-hunter-green-100
                  shadow-sm
                "
              >
                <FaUser size={14} />
              </div>

              {/* User information */}
              <div className="flex min-w-0 flex-1 flex-col items-start">
                <span className="w-full text-left truncate text-sm font-semibold text-norway-900">
                  {user?.username || "NA"}
                </span>
              </div>

              <FaChevronUp
                size={12}
                className={`shrink-0 text-norway-600 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : "group-hover:-translate-y-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
