import express from "express";
import { signup, login, getMe,forgotPassword,resetPassword } from "../controller/authController";
import { protect } from "../middleware/authMiddleware";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", protect, getMe);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);
export default authRouter;