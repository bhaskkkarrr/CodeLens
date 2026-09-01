import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdSettings } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { GoRepoForked } from "react-icons/go";
import logo from "/icon-remove_bg.png";
import { RxCross2 } from "react-icons/rx";
import { AnimatePresence, motion } from "motion/react";
const pages = [
  {
    id: "home",
    name: "Home",
    icon: <AiFillHome />,
  },
  {
    id: "repositories",
    name: "Repositories",
    icon: <GoRepoForked />,
  },
  {
    id: "setting",
    name: "Setting",
    icon: <IoMdSettings />,
  },
];
const DashNavBar = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  return (
    <div className="w-full md:px-10 px-5 py-4 border-b border-norway-600/50 flex justify-between items-center ">
      <div className="text-hunter-green-700 md:hidden block">
        <GiHamburgerMenu size={25} onClick={() => setShowSideBar(true)} />
      </div>
      <div className="md:text-3xl text-2xl font-semibold text-norway-800 md:hidden  ">
        CodeLens
      </div>
      <div className="md:text-xl font-semibold text-norway-800 hidden md:block ">
        Overview
      </div>
      <div className="text-hunter-green-100 rounded-2xl p-2 bg-hunter-green-700">
        <FaUser size={20} />
      </div>
      <AnimatePresence>
        {showSideBar && (
          <motion.div
            initial={{ x: -300, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            exit={{ x: -300, opacity: 0.5 }}
            className="fixed inset-0 z-999 w-full min-h-screen px-5 py-7 bg-hunter-green-100"
          >
            <div className="mb-10 flex items-center justify-between  gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-hunter-green-300 p-1">
                  <img
                    src={logo}
                    alt="CodeLens"
                    className="h-full w-full object-contain"
                  />
                </div>

                <span className="text-2xl font-semibold tracking-tight text-norway-800">
                  CodeLens
                </span>
              </div>
              <div className=" me-2" onClick={() => setShowSideBar(false)}>
                <RxCross2 size={25} />
              </div>
            </div>

            <nav className="flex flex-col gap-5">
              {pages.map((page) => (
                <button
                  key={page.id}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-mono text-lg text-norway-800 border border-hunter-green-400/80 transition bg-hunter-green-300/50 shadow-lg shadow-hunter-green-400/50"
                >
                  <span className="flex items-center text-lg">{page.icon}</span>

                  <span>{page.name}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashNavBar;
