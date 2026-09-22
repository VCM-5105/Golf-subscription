import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/index.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`Golf Subscription & Charity Draw Backend is running: http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.log("DATABASE connection failed !", err);
  });

export default app;
