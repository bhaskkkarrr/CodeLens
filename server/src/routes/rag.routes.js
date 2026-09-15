import { Router } from "express";
import * as ragControllers from "../controllers/rag.controller.js";
import { githubToken } from "../middleware/githubToken.middleware.js";
import { isVerified } from "../middleware/isVerified.middleware.js";

const ragRouter = Router();

ragRouter.post("/ask-question", isVerified, ragControllers.ask_questions);

export default ragRouter;
