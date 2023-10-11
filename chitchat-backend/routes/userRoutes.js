import { Router } from "express";
import {
  authUser,
  getAllUsers,
  registerUser,
} from "../controllers/userControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/").post(registerUser).get(protect, getAllUsers);
router.route("/login").post(authUser);

export default router;
