import express from "express";
import dotenv from "dotenv";
import axios from "axios";
const app = express();
dotenv.config();
app.get("/api/git-oauth", async (req, res) => {
  console.log(req.query);
  console.log(process.env.GITHUB_CLIENT_ID);
  console.log(process.env.GITHUB_CLIENT_SECRET);
  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: req.query.code,
    },
  );
  console.log("Response", response.data);

  const params = new URLSearchParams(response.data);
  console.log(params);
  let access_token = params.get("access_token");
  console.log("access_token", access_token);
  const authResponse = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  console.log("authRes", authResponse.data);
  res.send("OAuth callback received");
});
export default app;
