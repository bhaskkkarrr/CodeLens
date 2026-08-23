import { motion } from "motion/react";
import Hero from "../components/Home/Hero";
import ChatFeature from "../components/Home/ChatFeature";
import FeaturesCard from "../components/Home/FeaturesCard";
import Footer from "../components/Home/Footer";
import CTASection from "../components/Home/CTASection";
const Home = () => {
  return (
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
  );
};

export default Home;
