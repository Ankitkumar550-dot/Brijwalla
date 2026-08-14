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
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://brijwalla-lovat.vercel.app",
      ];
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

// Connect to DB and seed data
// Top-level await is supported because "type": "module" is in package.json
await connectDb();
await seedDatabase();

// In Vercel, we don't start the server with app.listen (Vercel handles it).
// But for Render and local development, we need to listen on the port.
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server started at ${port}`);
  });
}

// Export the Express app for Vercel Serverless functions
export default app;