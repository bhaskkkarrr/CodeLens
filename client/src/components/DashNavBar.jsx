import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdSettings } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { GoRepoForked } from "react-icons/go";
import logo from "/icon-remove_bg.png";
import { RxCross2 } from "react-icons/rx";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const DashNavBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full md:px-10 px-5 h-16 py-4 border-b border-norway-600/50 flex justify-between items-center ">
      <div className="md:text-3xl text-2xl font-semibold text-norway-800 md:hidden  ">
        CodeLens
      </div>
      <div className="md:text-xl font-semibold text-norway-800 hidden md:block ">
        Hello, {user?.username}
      </div>
      <div className="text-hunter-green-100 rounded-2xl p-2 bg-hunter-green-700">
        <FaUser size={20} />
      </div>
    </div>
  );
};

export default DashNavBar;
