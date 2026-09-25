import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { FaRobot, FaPaperPlane } from "react-icons/fa6";
import { useParams } from "react-router";
import { useRAG } from "../context/RAGContext";
import ChatBox from "../components/ChatBox";
import { BiLoaderAlt } from "react-icons/bi";
import QuestionsSidebar from "../components/QuestionsSidebar";

const Conversation = () => {
  const { getConversation, selectedChat, ask_question, selectedChatMessages } =
    useRAG();
  const [question, setQuestion] = useState("");
  const { conversationId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleGetConversation = async () => {
    await getConversation(conversationId);
  };
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const container = chatContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [selectedChatMessages]);

  useEffect(() => {
    handleGetConversation();
  }, [conversationId]);

  const handleAsk = async () => {
    try {
      setIsSubmitting(true);
      if (!question.trim()) return;
      await ask_question(question);
    } finally {
      setIsSubmitting(false);
      setQuestion("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col bg-norway-50">
      <main className="relative flex min-h-0 flex-1 flex-col">
        <div
          ref={chatContainerRef}
          className="min-h-0 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-hunter-green-500"
        >
          {selectedChatMessages?.length > 0 && (
            <QuestionsSidebar messages={selectedChatMessages} />
          )}

          <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-1 py-2 sm:px-6 sm:py-10 lg:px-8">
            {selectedChatMessages?.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <ChatBox messages={selectedChatMessages} />
                </motion.div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                {/* AI icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-hunter-green-200 text-hunter-green-800 shadow-sm"
                >
                  <FaRobot size={27} />
                </motion.div>

                {/* Heading */}
                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 text-2xl font-semibold tracking-tight text-hunter-green-950 sm:text-3xl"
                >
                  What can I help you understand?
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-3 max-w-xl text-sm leading-6 text-hunter-green-700 sm:text-base"
                >
                  Ask questions about your repository and CodeLens will answer
                  using your codebase as context.
                </motion.p>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="shrink-0 bg-linear-to-t from-norway-50 via-norway-50 to-transparent px-4 pb-4 pt-5 sm:px-6 sm:pb-6 lg:px-8">
          <div className="mx-auto w-full max-w-4xl">
            {/* Input */}
            <div className="flex items-end gap-2 rounded-2xl border border-hunter-green-300 bg-white p-2 shadow-lg shadow-hunter-green-900/5 transition-all focus-within:border-hunter-green-600 focus-within:ring-4 focus-within:ring-hunter-green-100">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAsk();
                  }
                }}
                rows={3}
                placeholder={`Ask about ${
                  selectedChat?.title || "your repository"
                }...`}
                className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 sm:text-lg text-sm  leading-6 text-hunter-green-950 outline-none placeholder:text-hunter-green-500"
              />

              <button
                type="button"
                onClick={handleAsk}
                disabled={isSubmitting}
                aria-label="Send question"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-hunter-green-800 text-white transition-all hover:bg-hunter-green-950 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? (
                  <div className="animate-spin">
                    <BiLoaderAlt size={20} />
                  </div>
                ) : (
                  <FaPaperPlane size={14} />
                )}
              </button>
            </div>

            {/* Disclaimer */}
            <p className="mt-2.5 text-center text-[10px] leading-5 text-hunter-green-600 sm:text-[11px]">
              CodeLens AI can make mistakes. Verify important answers against
              your source code.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Conversation;
