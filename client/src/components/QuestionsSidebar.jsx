import { CgLoadbar } from "react-icons/cg";

const QuestionsSidebar = ({ messages }) => {
  return (
    <div className="group fixed right-2 top-60 z-20 hidden lg:flex">
      <div className="flex w-12 flex-col gap-1 overflow-hidden rounded-2xl  transition-all duration-600 group-hover:w-70">
        {/* Collapsed icon */}
        <div className="group-hover:hidden">
          {messages.slice(0, 7).map((mess, idx) => {
            return (
              <div
                key={idx}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-hunter-green-500"
              >
                <CgLoadbar size={25} />
              </div>
            );
          })}
        </div>

        {/* Questions */}
        <div className=" max-h-70 flex-col gap-1 border border-hunter-green-300 bg-hunter-green-100 p-2 shadow-lg overflow-y-auto scrollbar-thin opacity-0 hidden transition-opacity duration-200 group-hover:opacity-100 group-hover:flex">
          {messages.map((message, index) => (
            <button
              key={message._id || index}
              onClick={() => {
                document.getElementById(message._id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-hunter-green-950 transition-colors hover:bg-hunter-green-200"
            >
              <span className="block truncate">{message.question}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsSidebar;
