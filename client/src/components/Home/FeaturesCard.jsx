import { IoIosGitBranch } from "react-icons/io";
import { LuShieldAlert } from "react-icons/lu";
import { BsChatLeftText } from "react-icons/bs";
import { motion } from "motion/react";
const STEPS = [
  {
    title: "Select repository",
    body: "Point CodeLens at any Git repository, public or private, and it starts indexing structure, history, and dependencies.",
    icon: IoIosGitBranch,
  },
  {
    title: "Get a health score",
    body: "A full pass for bugs, security risk, and quality debt, ranked by severity so your team knows what to fix first.",
    icon: LuShieldAlert,
  },
  {
    title: "Ask anything",
    body: "Ask how something works or where a bug might live, and get an answer grounded in your actual source, with citations.",
    icon: BsChatLeftText,
  },
];

const FeaturesCard = () => {
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
      id="workflow"
      className="max-w-6xl mx-auto px-6 py-10"
    >
      <div className="max-w-xl mb-12">
        <h2 className="mt-3 text-2xl sm:text-3xl font-mono text-norway-100">
          Three commands, start to finish
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STEPS.map(({ title, body, icon: Icon }, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: idx * 0.1,
                duration:0.5
              },
            }}
            key={title}
            className="rounded-xl border border-hunter-green-800 bg-hunter-green-900/40 p-6 hover:border-hunter-green-700 transition-colors"
          >
            <div className="mt-5 flex items-center gap-2.5 text-norway-100">
              <Icon size={18} className="text-norway-300" />
              <h3 className="text-base font-medium">{title}</h3>
            </div>
            <p className="mt-2.5 text-sm  text-norway-300 leading-relaxed">
              {body}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default FeaturesCard;
