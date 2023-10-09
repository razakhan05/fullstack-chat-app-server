import { Router } from "express";
import { authUser, registerUser } from "../controllers/userControllers.js";

const router = Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);

export default router;
