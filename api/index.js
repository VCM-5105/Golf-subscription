import dotenv from "dotenv";
dotenv.config();

import { app } from "../backend/src/app.js";

// Vercel serverless function export
export default app;
