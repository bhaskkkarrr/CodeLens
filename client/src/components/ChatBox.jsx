import React from "react";
import { marked } from "marked";

const ChatBox = ({ messages = [] }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4">
      <div className="space-y-6">
        {messages.map((message) => (
          <div key={message._id} className="space-y-2">

            {/* Question */}
            <div className="flex justify-end">
              <div className="max-w-[85%] sm:max-w-[75%]">
                <div className="rounded-2xl rounded-br-md bg-hunter-green-600 px-4 py-3 text-sm text-white sm:text-lg">
                  {message.question}
                </div>
              </div>
            </div>

            {/* Answer */}
            <div className="flex justify-start">
              <div className="w-full max-w-[95%] sm:max-w-[90%]">
                <div className=" px-4 py-4">

                  <div
                    className="
                      sm:text-lg text-sm leading-7 text-gray-800
                      dark:text-gray-200
                      [&_strong]:font-semibold
                      [&_code]:rounded
                      [&_code]:bg-hunter-green-100
                      [&_code]:px-1
                      [&_code]:py-0.5
                      [&_code]:sm:text-lg
                      dark:[&_code]:bg-gray-800
                      [&_pre]:my-4
                      [&_pre]:overflow-x-auto
                      [&_pre]:rounded-xl
                      [&_pre]:bg-gray-950
                      [&_pre]:p-4
                      [&_pre_code]:bg-transparent
                      [&_pre_code]:p-0
                      [&_ul]:my-3
                      [&_ul]:list-disc
                      [&_ul]:pl-6
                      [&_ol]:my-3
                      [&_ol]:list-decimal
                      [&_ol]:pl-6
                      [&_li]:my-1
                      [&_h1]:mb-3
                      [&_h1]:mt-5
                      [&_h1]:text-xl
                      [&_h1]:font-bold
                      [&_h2]:mb-3
                      [&_h2]:mt-5
                      [&_h2]:text-lg
                      [&_h2]:font-semibold
                      [&_h3]:mb-2
                      [&_h3]:mt-4
                      [&_h3]:font-semibold
                    "
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(message.answer || ""),
                    }}
                  />

                  {/* Sources */}
                  {message.sources?.length > 0 && (
                    <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
                      <p className="mb-2 text-lg font-semibold uppercase tracking-wide text-hunter-green-500">
                        Sources
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {message.sources.map((source, index) => (
                          <span
                            key={`${source}-${index}`}
                            title={source}
                            className="
                              max-w-full truncate rounded-lg 
                              bg-hunter-green-100 px-2.5 py-1.5
                              text-sm text-gray-700
                            "
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;

