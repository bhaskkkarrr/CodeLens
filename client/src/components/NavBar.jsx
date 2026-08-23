import React from "react";
import { motion } from "motion/react";
const NavBar = () => {
  return (
    <motion.div className="w-full flex mx-3 py-3 justify-between items-center cursor-default">
      <div className="text-3xl text-bossanova-950 text-norway-100 font-semibold">Code Lens</div>
      <motion.div  className="text-hunter-green-950 font-semibold text-xl rounded-2xl bg-norway-300 px-4 py-1 hover:bg-norway-400 cursor-pointer  flex justify-center hover:rounded-full items-center">
        Get started
      </motion.div>
    </motion.div>
  );
};

export default NavBar;
