import { Router } from "express";
import protectMiddleware from "../middleware/authMiddleware.js";
import {
  addUserToGroupChat,
  createGroupChat,
  createUserChat,
  getUserChats,
  leaveGroupChat,
  renameGroupChat,
} from "../controllers/chatControllers.js";

const router = Router();

// User-related chat routes
router.route("/").post(protectMiddleware, createUserChat);
router.route("/").get(protectMiddleware, getUserChats);

// // Group chat routes
router.route("/group").post(protectMiddleware, createGroupChat);
router.route("/renamegroup").put(protectMiddleware, renameGroupChat);
router.route("/groupadd").put(protectMiddleware, addUserToGroupChat);
router.route("/groupleave").put(protectMiddleware, leaveGroupChat);

export default router;
