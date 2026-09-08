import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { isVerified } from "../middleware/isVerified.middleware.js";
import { decodeFirebaseToken } from "../middleware/decodeFirebaseToken.js";
import { githubToken } from "../middleware/githubToken.middleware.js";
const authRouter = Router();
authRouter.post("/register", decodeFirebaseToken, authController.register);
authRouter.post("/login", decodeFirebaseToken, authController.login);
authRouter.post(
  "/firebase-auth",
  decodeFirebaseToken,
  authController.firebaseAuth,
);
authRouter.get("/me", authController.me);
authRouter.post("/verify-otp", decodeFirebaseToken, authController.otpVerify);
authRouter.get("/github-auth", authController.connectGithub);
authRouter.post("/logout", isVerified, authController.logout);
authRouter.get("/disconnect-github", isVerified, authController.disconnectGithub);

export default authRouter;
