import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa";
import { useSearchParams } from "react-router";

const Dashboard = () => {
  const handleGithubConnect = async () => {
    
    window.location.href = `https://github.com/login/oauth/authorize?scope=user:email+offline_access&client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}`;
  };
  useEffect(() => {
    // const [searchParams] = useSearchParams();
    const params = new URLSearchParams(window.location.search);
    console.log(import.meta.env.VITE_GITHUB_CLIENT_ID)
    const reason = params.get("reason");
    if (reason) {
      if (reason == "github_already_connected") {
        toast.error("Github already connected");
      } else if (reason == "missing_refresh_token") {
        toast.error("Token not found! Github not connected");
      } else if (reason == "token_failed") {
        toast.error("Invalid token! Github not connected");
      } else if (reason == "missing_code") {
        toast.error("Invalid token! Github not connected");
      } else if (reason == "invalid_user") {
        toast.error("Invalid token! Github not connected");
      } else if (reason == "user_not_logged_in") {
        toast.error("Login first");
      } else {
        toast.error("Server error");
      }
    }
  }, []);
  return (
    <div className="m-10">
      <div
        className="flex gap-4 justify w-fit items-center rounded-2xl px-3 py-1.5 bg-hunter-green-400 text-norway-50"
        onClick={handleGithubConnect}
      >
        Connect <FaGithub />
      </div>
    </div>
  );
};

export default Dashboard;
