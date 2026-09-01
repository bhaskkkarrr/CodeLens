import { motion } from "motion/react";
import { useNavigate } from "react-router";
const NavBar = () => {
  const navigate = useNavigate();
  return (
    <header className="w-full border-b border-hunter-green-800/80">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 ">
          <span className="font-mono md:text-2xl text-lg text-norway-100 tracking-tight">
            Code<span className="text-norway-300">Lens</span>
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.99 }}
          className="rounded-2xl  bg-norway-300 px-4 py-2 text-md font-medium text-hunter-green-950 hover:bg-norway-400 transition-colors"
          onClick={() => navigate("/auth")}
        >
          Get started
        </motion.button>
      </nav>
    </header>
  );
};

export default NavBar;
