import { Router } from "express";
import protectMiddleware from "../middleware/authMiddleware.js";
import { allMessages, sendMessage } from "../controllers/messageController.js";

const router = Router();

router.route("/").post(protectMiddleware, sendMessage);
router.route("/:chatId").get(protectMiddleware, allMessages);

export default router;
