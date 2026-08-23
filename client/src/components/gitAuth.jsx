import React from "react";

const GitAuth = () => {
  const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

  const REDIRECT_URI = "http://localhost:5001/api/git-oauth";
  console.log("CLIENT_ID:", CLIENT_ID);
  const handleGithubLogin = () => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: "read:user",
    });
    const url = `https://github.com/login/oauth/authorize?${params.toString()}`;

    console.log("OAuth URL:", url);

    window.location.href = url;
  };

  return (
    <div>
      <p>Well, hello there!</p>

      <button onClick={handleGithubLogin} className="text-amber-700 font-bold">
        Login with GitHub
      </button>
    </div>
  );
};

export default GitAuth;
