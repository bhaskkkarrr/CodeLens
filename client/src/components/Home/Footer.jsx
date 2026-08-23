import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-hunter-green-800/80">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2 font-mono text-sm text-hunter-green-500">
          CodeLens © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
