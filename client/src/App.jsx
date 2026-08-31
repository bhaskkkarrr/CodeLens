import { Route, Routes } from "react-router";
import Home from "./page/Home";
import Login from "./page/Login";
import { Toaster } from "react-hot-toast";
import VerifyOTP from "./page/VerifyOTP";
import { motion } from "motion/react";
const App = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 overflow-hidden bg-hunter-green-950"
      >
        {/* base vertical gradient, deep hunter-green */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#182619_0%,#1a2517_38%,#152012_75%,#111a0f_100%)]" />

        {/* large soft color blooms for depth */}
        <motion.div className="absolute -top-40 animate-pulse -left-32 h-152 w-152 rounded-full bg-norway-600/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-136 animate-pulse w-136 rounded-full bg-norway-500/40 blur-[130px]" />
        <div className="absolute -bottom-48 left-1/ animate-pulse h-120 w-120 rounded-full bg-norway-700/30 blur-[110px]" />

        {/* fine graph-paper grid, like an editor's line/column guides */}
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(#acc8a2_1px,transparent_1px),linear-gradient(90deg,#acc8a2_1px,transparent_1px)] bg-size-[44px_44px] sm:bg-size-[56px_56px]" />
      </div>
      <Toaster />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        {/* Dashboard */}
      </Routes>
    </>
  );
};

export default App;
