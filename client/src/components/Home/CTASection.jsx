import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "motion/react";
const CTASection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
        },
      }}
      className="max-w-6xl mx-auto px-6 py-10"
    >
      <div className="rounded-2xl border border-hunter-green-800 bg-linear-to-br from-hunter-green-900 to-hunter-green-900/40 px-8 py-14 sm:px-14 text-center">
        <h2 className="text-2xl sm:text-3xl font-mono text-norway-100">
          Point it at a repo. See what it finds.
        </h2>
        <p className="mt-3 text-norway-300">
          Free to start, no credit card required.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.99 }}
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-norway-300 px-6 py-3 text-sm font-medium text-hunter-green-950 hover:bg-norway-400 transition-colors"
        >
          Get started
          <FaArrowRightLong size={16} />
        </motion.button>
      </div>
    </motion.section>
  );
};

export default CTASection;
