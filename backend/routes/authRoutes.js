import express from "express";
import { googleAuth, resetPassword, sendOtp, signUp, signin, signout, verifyOtp } from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signin);
authRouter.get("/signout", signout);
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/google-auth", googleAuth)

export default authRouter;