import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import connectDB from "./config/connectDB.js";
import config from "./config/config.js";

const app = express();
dotenv.config();

// Database Connect
connectDB();

app.get("/api/git-oauth", async (req, res) => {
  console.log(req.query);
  console.log(process.env.GITHUB_CLIENT_ID);
  console.log(process.env.GITHUB_CLIENT_SECRET);
  
  res.send("OAuth callback received");
});

app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);

export default app;
