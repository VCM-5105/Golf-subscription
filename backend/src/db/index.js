import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const connectDB = async () => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in environment variables.");
      return null;
    }
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error && error.code !== "PGRST116" && error.code !== "PGRST205") {
      console.warn("Database query notice: ", error.message);
      return null;
    }
    console.log("Supabase PostgreSQL connected successfully.");
    return supabase;
  } catch (error) {
    console.error("DATABASE connection notice: ", error.message || error);
    return null;
  }
};

export default supabase;
