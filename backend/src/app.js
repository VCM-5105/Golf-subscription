import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middlewares/error.middleware.js";

// Import Routers
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import scoreRouter from "./routes/score.routes.js";
import drawRouter from "./routes/draw.routes.js";
import charityRouter from "./routes/charity.routes.js";
import winnerRouter from "./routes/winner.routes.js";
import adminRouter from "./routes/admin.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server) or matching origins
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Static files for uploaded scorecards & charity media
app.use("/uploads", express.static(path.resolve(__dirname, "../public/uploads")));


app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Golf Subscription & Charity Draw API is fully operational"
  });
});

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/scores", scoreRouter);
app.use("/api/v1/draws", drawRouter);
app.use("/api/v1/charities", charityRouter);
app.use("/api/v1/winners", winnerRouter);
app.use("/api/v1/admin", adminRouter);

app.use(errorHandler);

export { app };
