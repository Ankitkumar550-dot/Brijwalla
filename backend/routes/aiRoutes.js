import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getMithaiRecommendation } from "../controllers/aiControllers.js";

const aiRouter = express.Router();
aiRouter.post("/recommend", isAuth, getMithaiRecommendation);

export default aiRouter;
