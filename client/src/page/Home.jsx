import { motion } from "motion/react";
import { useNavigate } from "react-router";

import Hero from "../components/Home/Hero";
import ChatFeature from "../components/Home/ChatFeature";
import FeaturesCard from "../components/Home/FeaturesCard";
import Footer from "../components/Home/Footer";
import CTASection from "../components/Home/CTASection";
const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="max-w-4xl px-5 py-2 mx-auto w-full flex justify-between items-center my-4">
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
      </div>
      <div className="max-w-4xl mx-auto w-full flex flex-col justify-between items-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 1.4,
            },
          }}
          className=" flex flex-col g"
        >
          <Hero />
          <FeaturesCard />
          <ChatFeature />
          <CTASection />
          <Footer />
        </motion.div>
      </div>
    </>
  );
};

export default Home;
