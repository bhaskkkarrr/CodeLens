import { motion } from "motion/react";
function ScoreRow({ label, count, tone }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
      <span className="font-mono text-sm text-norway-200 flex-1">{label}</span>
      <span className="font-mono text-sm text-hunter-green-500">{count}</span>
    </div>
  );
}

const ChatFeature = () => {
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
      id="product"
      className="max-w-6xl mx-auto px-6 py-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-mono text-norway-100 leading-tight">
            Your codebase becomes searchable
          </h2>
          <p className="mt-5 typewriter text-norway-300 leading-relaxed max-w-md">
            Stop digging through thousands of lines to understand how something
            works. Ask CodeLens directly, and get an answer with the exact files
            and line numbers behind it.
          </p>
        </div>

        {/* health score card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="rounded-xl border border-hunter-green-800 bg-hunter-green-900/60 p-6"
        >
          <div className="mt-5 space-y-4">
            <ScoreRow label="critical" count={2} tone="bg-red-500" />
            <ScoreRow label="high" count={5} tone="bg-amber-500" />
            <ScoreRow label="medium" count={7} tone="bg-norway-500" />
          </div>
          <div className="mt-6 pt-5 border-t border-hunter-green-800 flex items-center justify-between">
            <span className="font-mono text-xs text-hunter-green-500">
              14 issues found across 6 files
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ChatFeature;
