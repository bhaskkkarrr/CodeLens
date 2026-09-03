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

app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.head("/", (req, res) => {
  res.status(200);
});
app.use("/api/auth", authRouter);

export default app;
