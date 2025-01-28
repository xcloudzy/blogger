import express from "express";
import { protect } from "../middleware/auth.js";
import * as authController from "../controllers/auth.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", protect, authController.getMe);

export default router;
