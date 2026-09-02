import { FaGithub } from "react-icons/fa";

const Dashboard = () => {
  const handleGithubConnect = async () => {
    window.location.href = `https://github.com/login/oauth/authorize?scope=user:email+offline_access&client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}`;
  };
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
