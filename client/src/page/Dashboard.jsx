import { useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { GlobalLoader } from "../components/Loaders";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleGithubConnect = async () => {
    window.location.href = `https://github.com/login/oauth/authorize?scope=user:email+offline_access&client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reason = params.get("reason");
    if (reason) {
      if (reason == "github_already_connected") {
        toast.error("Github already connected");
        navigate("/");
      } else if (reason == "missing_refresh_token") {
        toast.error("Token not found! Github not connected");
        navigate("/");
      } else if (reason == "token_failed") {
        toast.error("Invalid token! Github not connected");
        navigate("/");
      } else if (reason == "missing_code") {
        toast.error("Invalid token! Github not connected");
        navigate("/");
      } else if (reason == "invalid_user") {
        toast.error("Invalid token! Github not connected");
        navigate("/");
      } else if (reason == "user_not_logged_in") {
        toast.error("Login first");
        navigate("/");
      } else {
        toast.error("Server error");
        navigate("/");
      }
    }
  }, []);
  if (!user) {
    return <GlobalLoader />;
  }
  const isGitConnected = user.gitConnected;

  return (
    <div className="p-10 min-h-[calc(100vh-64px)] relative flex flex-col justify-center items-center">
      <div className="absolute top-3 left-5 md:text-xl">Hello {user.username},</div>
      {!isGitConnected ? (
        <div className=" mx-auto flex flex-col justify-center items-center border border-hunter-green-200/70 shadow-lg shadow-hunter-green-200/70 p-5 md:p-10 rounded-2xl space-y-6">
          <div className="text-hunter-green-600">
            <FaGithub size={40} />{" "}
          </div>
          <div className="text-center md:text-xl text-lg">
            Connect your GitHub account to start{" "}
            <br className="hidden md:block" /> analyzing and chatting with
            repositories
          </div>
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.91 }}
            className="flex gap-4 justify cursor-pointer text-lg items-center rounded-2xl px-3 py-1.5 bg-hunter-green-600 font-mono text-norway-50"
            onClick={handleGithubConnect}
          >
            Connect <FaGithub />
          </motion.div>
        </div>
      ) : (
        <div className=" mx-auto flex flex-col justify-center items-center border border-hunter-green-200/70 shadow-lg shadow-hunter-green-200/70 p-5 md:p-10 rounded-2xl space-y-6">
          
        </div>
      )}
    </div>
  );
};

export default Dashboard;
