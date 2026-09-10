import { Router } from "express";
import * as gitControllers from "../controllers/git.controller.js";
import { githubToken } from "../middleware/githubToken.middleware.js";
import { isVerified } from "../middleware/isVerified.middleware.js";

const githubRouter = Router();

githubRouter.get(
  "/repositories",
  isVerified,
  githubToken,
  gitControllers.getAllRepositories,
);

githubRouter.post("/clone", isVerified, githubToken, gitControllers.cloneRepository)

export default githubRouter;
