import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const connectDB = async () => {
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error && error.code !== "PGRST116" && error.code !== "PGRST205") {
      throw error;
    }
    console.log("Supabase PostgreSQL connected successfully.");
    return supabase;
  } catch (error) {
    console.error("DATABASE connection error ", error);
    process.exit(1);
  }
};

export default supabase;
