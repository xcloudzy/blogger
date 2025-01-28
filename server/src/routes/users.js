import express from "express";
import { protect, admin } from "../middleware/auth.js";
import * as userController from "../controllers/users.js";

const router = express.Router();

// All routes are protected and require admin access
router.use(protect, admin);

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.delete("/:id", userController.deleteUser);

export default router;
