import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import { seedDatabase } from "./utils/seeder.js";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import shopRouter from "./routes/shopRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import festivalRouter from "./routes/festivalRoutes.js";

dotenv.config();

console.log("EMAIL =", process.env.EMAIL);
console.log("PASS =", process.env.PASS ? "FOUND" : "MISSING");

const app = express();
const port = process.env.PORT || 9000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://brijwalla-lovat.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);
app.use("/api/ai", aiRouter);
app.use("/api/festivals", festivalRouter);


app.listen(port, async () => {
  await connectDb();
  await seedDatabase();
  console.log(`Server started at ${port}`);
});