import express from "express";
import * as chatController from "../controllers/chat.controller.js";
import { isVerified } from "../middleware/isVerified.middleware.js";

const chatRouter = express.Router();

chatRouter.get("/c/:chatId", isVerified, chatController.getConversation);
chatRouter.get("/chats", isVerified, chatController.allConversations);

export default chatRouter;
