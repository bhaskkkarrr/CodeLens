import { IoMdSettings } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { GoRepoForked } from "react-icons/go";
import logo from "/icon-remove_bg.png";
import { FaUser } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";

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

const SideBar = () => {
  return (
    <aside className="min-h-screen w-full border-r border-norway-700/30 bg-linear-to-tl  from-norway-100 to-hunter-green-200">
      <div className="flex min-h-screen flex-col px-5 py-6 md:px-8">
        {/* Logo */}
        <div className="mb-10 flex items-center gap-3">
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

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-norway-700/60">
            Workspace
          </p>

          {pages.map((page) => (
            <button
              key={page.id}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-mono text-base text-norway-800 transition hover:bg-hunter-green-300/50"
            >
              <span className="flex items-center text-lg">{page.icon}</span>

              <span>{page.name}</span>
            </button>
          ))}
        </nav>

        {/* Profile - automatically pushed to bottom */}
        <div className="mt-auto border-t border-norway-700/20 pt-5">
          <button className="flex w-full items-center gap-3 rounded-xl p-2 px-3 transition hover:bg-norway-300/50">
            {/* Profile icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hunter-green-700 text-hunter-green-100">
              <FaUser size={15} />
            </div>

            {/* User info */}
            <div className="flex flex-1 flex-col items-start">
              <span className="text-sm font-semibold text-norway-800">
                Bhaskar
              </span>

              <span className="text-xs text-norway-700/60">Free Plan</span>
            </div>

            <FaChevronUp size={13} className="text-norway-700/70" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
