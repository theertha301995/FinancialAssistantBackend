import express from "express";
import { signup, login, getMe } from "../controller/authController";
import { protect } from "../middleware/authMiddleware";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", protect, getMe);

export default authRouter;