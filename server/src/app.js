import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/connectDB.js";
import config from "./config/config.js";

// Routers
import authRouter from "./routes/auth.routes.js";
import githubRouter from "./routes/git.routes.js";
import ragRouter from "./routes/rag.routes.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();
dotenv.config();

// Database Connect
connectDB();

app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/git", githubRouter);
app.use("/api/rag", ragRouter);
app.use("/api/chat", chatRouter);

app.head("/", (req, res) => {
  res.status(200).end();
});

export default app;
