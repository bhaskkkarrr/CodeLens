import React from "react";

const Hero = () => {
  return (
    <div className="flex flex-col gap-5 md:gap-10 cursor-default md:mt-15">
      <h1 className="text-6xl text-norway-100 md:text-center  ">
        Understand Your <span className="bg-hunter-green-500/50 rounded-2xl  animate-pulse duration-1000 px-3 ">Codebase.</span> Ask It Anything.
      </h1>
      <h3 className="text-xl text-norway-300 text-justify md:mx-20 md:text-2xl">
        CodeLens analyzes your repository for bugs, security risks, and code
        quality issues — then lets you ask questions about your codebase using
        AI.
      </h3>
    </div>
  );
};

export default Hero;
