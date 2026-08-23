import { HiSparkles } from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";
import { motion } from "motion/react";
const Hero = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-hunter-green-800 bg-hunter-green-900/60 px-3 py-1 font-mono text-xs text-norway-400">
            <HiSparkles size={13} />
            now reading every commit
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl font-mono font-medium leading-[1.1] text-norway-100">
            Understand your{" "}
            <span className="px-2 rounded-2xl animate-pulse duration-500 bg-hunter-green-300/50">
              codebase.
            </span>
            <br />
            <span className="text-norway-300">Ask it anything.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-norway-300 leading-relaxed max-w-md typewriter">
            CodeLens scans your repository for bugs, security risk, and quality
            issues — then lets your team ask questions about the code, in plain
            language, and get answers grounded in the actual source.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.99 }}
              className="inline-flex items-center gap-2 rounded-lg bg-norway-300 px-5 py-3 text-sm font-medium text-hunter-green-950 hover:bg-norway-400 transition-colors"
            >
              Connect a repository
              <FaGithub size={16} />
            </motion.button>
          </div>
        </div>

        {/* Editor window mock — signature element */}
        <motion.div
          whileHover={{ scale: 1.05}}
          className="rounded-xl typewriter border border-hunter-green-800 bg-hunter-green-900/60 shadow-2xl shadow-hunter-green-950/40 overflow-hidden"
        >
          {/* tab bar */}
          <div className="flex items-center  gap-1.5 border-b border-hunter-green-800 bg-hunter-green-950/60 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-hunter-green-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-hunter-green-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-hunter-green-700" />
            <div className="ml-4 flex gap-4 font-mono text-xs">
              <span className="text-norway-100 border-b-2 typewriter border-norway-300 pb-3 -mb-3">
                auth.js
              </span>
              <span className="text-hunter-green-500 typewriter">
                session.js
              </span>
              <span className="text-hunter-green-500 typewriter">
                README.md
              </span>
            </div>
          </div>

          {/* body: line numbers + code-styled Q&A */}
          <div className="flex font-mono text-[13px] leading-6">
            <div className="select-none px-4 py-5 text-right text-hunter-green-700 bg-hunter-green-950/30">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div className="px-4 py-5 text-norway-300 flex-1 min-w-0">
              <div>
                <span className="text-hunter-green-600">// </span>
                <span className="text-norway-500 typewriter">ask</span>
                <span className="text-hunter-green-500">:</span>
              </div>
              <div className="text-norway-100 typewriter">
                "How does session refresh work here?"
              </div>
              <div className="h-3" />
              <div>
                <span className="text-hunter-green-600">// </span>
                <span className="text-norway-300 typewriter">codelens</span>
                <span className="text-hunter-green-500">:</span>
              </div>
              <div className="text-norway-300 typewriter">
                Tokens are issued in{" "}
                <span className="text-norway-500 typewriter">auth.js:42</span>{" "}
                and
              </div>
              <div className="text-norway-300 typewriter">
                refreshed by a cron in{" "}
                <span className="text-norway-500 typewriter">
                  session.js:18
                </span>{" "}
                <span className="inline-block w-2 h-4 bg-norway-300/80 align-middle animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
