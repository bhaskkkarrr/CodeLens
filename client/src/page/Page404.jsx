import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Page404 = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 overflow-hidden bg-hunter-green-950"
      >
        {/* base vertical gradient, deep hunter-green */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#182619_0%,#1a2517_38%,#152012_75%,#111a0f_100%)]" />

        {/* large soft color blooms for depth */}
        <motion.div className="absolute -top-40 animate-pulse -left-32 h-152 w-152 rounded-full bg-norway-600/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-136 animate-pulse w-136 rounded-full bg-norway-500/40 blur-[130px]" />
        <div className="absolute -bottom-48 left-1/ animate-pulse h-120 w-120 rounded-full bg-norway-700/30 blur-[110px]" />

        {/* fine graph-paper grid, like an editor's line/column guides */}
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(#acc8a2_1px,transparent_1px),linear-gradient(90deg,#acc8a2_1px,transparent_1px)] bg-size-[44px_44px] sm:bg-size-[56px_56px]" />
      </div>
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-hunter-green-50">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-norway-100 sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              onClick={() => {
                if (token) {
                  navigate("/dashboard");
                } else {
                  navigate("/");
                }
              }}
              className="rounded-md bg-hunter-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-hunter-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hunter-green-600"
            >
              Go back home
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page404;
