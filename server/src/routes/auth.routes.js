import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { isVerified } from "../middleware/isVerified.middleware.js";
const authRouter = Router();
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/google-auth", authController.googleAuth);
authRouter.get("/me", authController.me);
authRouter.post("/logout", isVerified, authController.logout);

export default authRouter;
