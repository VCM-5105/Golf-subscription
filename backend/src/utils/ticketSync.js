import { supabase } from "../db/index.js";
import { SUBSCRIPTION_STATUS } from "../constants.js";


export const syncUserDrawTicket = async (userId) => {
  try {
    const { data: user } = await supabase
      .from("users")
      .select("id, name, subscription")
      .eq("id", userId)
      .maybeSingle();

    if (!user) return null;

    const { data: activeDraw } = await supabase
      .from("draws")
      .select("id, status")
      .in("status", ["upcoming", "active"])
      .order("draw_date", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!activeDraw) return null;

    const isActiveSub = user.subscription?.status === SUBSCRIPTION_STATUS.ACTIVE;

    // Fetch user's latest 5 scores ordered chronologically descending
    const { data: scores } = await supabase
      .from("scores")
      .select("score, date")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(5);

    const hasFiveScores = scores && scores.length === 5;

    if (isActiveSub && hasFiveScores) {
      const numbers = scores.map((s) => s.score).sort((a, b) => a - b);

      const { data: existingTicket } = await supabase
        .from("tickets")
        .select("id")
        .eq("draw_id", activeDraw.id)
        .eq("user_id", userId)
        .maybeSingle();

      if (existingTicket) {
        await supabase
          .from("tickets")
          .update({
            numbers,
            user_name: user.name,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingTicket.id);
      } else {
        await supabase.from("tickets").insert({
          id: `tkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          draw_id: activeDraw.id,
          user_id: userId,
          user_name: user.name,
          numbers,
          assigned_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    } else {
      // If user no longer qualifies, remove ticket for this active draw
      await supabase
        .from("tickets")
        .delete()
        .eq("draw_id", activeDraw.id)
        .eq("user_id", userId);
    }
  } catch (err) {
    console.error("Error in syncUserDrawTicket:", err);
  }
};
