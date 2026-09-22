import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { supabase } from "../db/index.js";

export const getActiveDraw = asyncHandler(async (req, res) => {
  const { data: activeDraw, error } = await supabase
    .from("draws")
    .select("*")
    .in("status", ["upcoming", "active"])
    .order("draw_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !activeDraw) {
    throw new ApiError(404, "No active draw currently configured.");
  }

  const { data: users } = await supabase.from("users").select("subscription");
  const activeCount = (users || []).filter((u) => u.subscription?.status === "active").length;
  const basePool = activeCount * 10;

  const { data: settings } = await supabase.from("settings").select("value").eq("key", "jackpot").maybeSingle();
  const rollover = Number(settings?.value?.currentJackpotRollover || activeDraw.rollover_jackpot || 0);

  let userTicket = null;
  if (req.user) {
    const { data: ticket } = await supabase
      .from("tickets")
      .select("*")
      .eq("draw_id", activeDraw.id)
      .eq("user_id", req.user.id)
      .maybeSingle();
    userTicket = ticket || null;
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...activeDraw,
        drawNumber: activeDraw.draw_number,
        drawDate: activeDraw.draw_date,
        winningNumbers: activeDraw.winning_numbers,
        activeSubscribersCount: activeCount,
        basePool,
        rolloverJackpot: rollover,
        projectedTotalPool: basePool + rollover,
        tiers: {
          match5: { name: "5-Number Match", poolShare: 0.40, totalTierPool: (basePool * 0.40) + rollover, rolloverAllowed: true },
          match4: { name: "4-Number Match", poolShare: 0.35, totalTierPool: basePool * 0.35, rolloverAllowed: false },
          match3: { name: "3-Number Match", poolShare: 0.25, totalTierPool: basePool * 0.25, rolloverAllowed: false }
        },
        userTicket
      },
      "Active draw information retrieved."
    )
  );
});

export const getDrawHistory = asyncHandler(async (req, res) => {
  const { data: draws } = await supabase
    .from("draws")
    .select("*")
    .eq("status", "published")
    .order("draw_date", { ascending: false });

  const mapped = (draws || []).map((d) => ({
    ...d,
    drawNumber: d.draw_number,
    drawDate: d.draw_date,
    winningNumbers: d.winning_numbers,
    totalPool: d.total_pool,
    publishedAt: d.published_at
  }));

  return res.status(200).json(new ApiResponse(200, mapped, "Historical draws retrieved."));
});

export const getDrawDetails = asyncHandler(async (req, res) => {
  const { drawId } = req.params;
  const { data: draw } = await supabase.from("draws").select("*").eq("id", drawId).maybeSingle();
  if (!draw) throw new ApiError(404, "Draw not found.");

  const { data: winners } = await supabase.from("winners").select("*").eq("draw_id", drawId);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        draw: {
          ...draw,
          drawNumber: draw.draw_number,
          drawDate: draw.draw_date,
          winningNumbers: draw.winning_numbers
        },
        winners: winners || []
      },
      "Draw details retrieved."
    )
  );
});

export const getMyDrawTicket = asyncHandler(async (req, res) => {
  const { data: activeDraw } = await supabase
    .from("draws")
    .select("*")
    .in("status", ["upcoming", "active"])
    .limit(1)
    .maybeSingle();

  if (!activeDraw) {
    return res.status(200).json(new ApiResponse(200, null, "No active draw."));
  }

  const { data: ticket } = await supabase
    .from("tickets")
    .select("*")
    .eq("draw_id", activeDraw.id)
    .eq("user_id", req.user.id)
    .maybeSingle();

  const { data: scores } = await supabase.from("scores").select("id").eq("user_id", req.user.id);
  const count = scores?.length || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ticket: ticket || null,
        scoresCount: count,
        eligible: count === 5 && req.user.subscription?.status === "active",
        activeDrawId: activeDraw.id,
        drawDate: activeDraw.draw_date
      },
      "User ticket status retrieved."
    )
  );
});
