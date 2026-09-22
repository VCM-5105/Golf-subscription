import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { supabase } from "../db/index.js";
import { syncUserDrawTicket } from "../utils/ticketSync.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const { data: users, error } = await supabase
    .from("users")
    .select("id, name, email, role, subscription, charity, handicap, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new ApiError(500, error.message);

  const { data: scores } = await supabase.from("scores").select("*");

  const result = (users || []).map((u) => {
    const userScores = (scores || []).filter((s) => s.user_id === u.id);
    return {
      ...u,
      scores: userScores,
      scoresCount: userScores.length
    };
  });

  return res.status(200).json(new ApiResponse(200, result, "Users retrieved."));
});

export const adminUpdateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, handicap, role, subscriptionStatus, renewalDate } = req.body;

  const updates = { updated_at: new Date().toISOString() };
  if (name) updates.name = name;
  if (email) updates.email = email.toLowerCase();
  if (handicap !== undefined) updates.handicap = Number(handicap);
  if (role) updates.role = role;

  if (subscriptionStatus || renewalDate) {
    const { data: user } = await supabase.from("users").select("subscription").eq("id", userId).single();
    updates.subscription = {
      ...user?.subscription,
      status: subscriptionStatus || user?.subscription?.status || "active",
      renewalDate: renewalDate || user?.subscription?.renewalDate || new Date().toISOString()
    };
  }

  const { data: updated, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new ApiError(400, error.message);

  await syncUserDrawTicket(userId);
  const { password, ...safeUser } = updated;

  return res.status(200).json(new ApiResponse(200, safeUser, "User updated successfully."));
});

export const adminUpdateUserScores = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { scores } = req.body;

  if (!Array.isArray(scores)) {
    throw new ApiError(400, "Scores array required.");
  }

  await supabase.from("scores").delete().eq("user_id", userId);

  const formatted = scores.slice(0, 5).map((s, idx) => ({
    id: `sc_${Date.now()}_${idx}`,
    user_id: userId,
    date: s.date || new Date().toISOString().split("T")[0],
    score: Number(s.score),
    course: s.course || "Verified Round",
    notes: s.notes || "Admin updated"
  }));

  if (formatted.length > 0) {
    await supabase.from("scores").insert(formatted);
  }

  await syncUserDrawTicket(userId);
  return res.status(200).json(new ApiResponse(200, formatted, "Scores updated successfully."));
});

export const getDrawManagementData = asyncHandler(async (req, res) => {
  const { data: activeDraw } = await supabase
    .from("draws")
    .select("*")
    .in("status", ["upcoming", "active"])
    .order("draw_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: allDraws } = await supabase
    .from("draws")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: users } = await supabase.from("users").select("subscription");
  const activeSubscribers = (users || []).filter((u) => u.subscription?.status === "active").length;

  const { data: settingsRow } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "jackpot")
    .maybeSingle();

  const rollover = Number(settingsRow?.value?.currentJackpotRollover || activeDraw?.rollover_jackpot || 0);
  const basePool = activeSubscribers * 10;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        activeDraw: activeDraw ? {
          ...activeDraw,
          drawNumber: activeDraw.draw_number,
          drawDate: activeDraw.draw_date,
          winningNumbers: activeDraw.winning_numbers
        } : null,
        allDraws: (allDraws || []).map((d) => ({
          ...d,
          drawNumber: d.draw_number,
          drawDate: d.draw_date,
          winningNumbers: d.winning_numbers
        })),
        settings: { currentJackpotRollover: rollover },
        stats: {
          activeSubscribers,
          basePool,
          rolloverJackpot: rollover,
          totalPool: basePool + rollover
        }
      },
      "Draw data loaded."
    )
  );
});

export const simulateDraw = asyncHandler(async (req, res) => {
  const { customWinningNumbers, logicType } = req.body;

  const { data: activeDraw } = await supabase
    .from("draws")
    .select("*")
    .in("status", ["upcoming", "active"])
    .limit(1)
    .maybeSingle();

  if (!activeDraw) throw new ApiError(404, "No active draw to simulate.");

  const { data: tickets } = await supabase.from("tickets").select("*").eq("draw_id", activeDraw.id);

  let drawnNumbers = [];
  if (Array.isArray(customWinningNumbers) && customWinningNumbers.length === 5) {
    drawnNumbers = [...customWinningNumbers].sort((a, b) => a - b);
  } else {
    const picked = new Set();
    while (picked.size < 5) picked.add(Math.floor(Math.random() * 45) + 1);
    drawnNumbers = Array.from(picked).sort((a, b) => a - b);
  }

  const match5 = [], match4 = [], match3 = [];
  (tickets || []).forEach((t) => {
    const matched = (t.numbers || []).filter((n) => drawnNumbers.includes(n));
    const entry = { userId: t.user_id, userName: t.user_name, matchedNumbers: matched, ticketNumbers: t.numbers };
    if (matched.length === 5) match5.push(entry);
    else if (matched.length === 4) match4.push(entry);
    else if (matched.length === 3) match3.push(entry);
  });

  const { data: settingsRow } = await supabase.from("settings").select("value").eq("key", "jackpot").maybeSingle();
  const rollover = Number(settingsRow?.value?.currentJackpotRollover || activeDraw.rollover_jackpot || 0);
  const basePool = (tickets?.length || 0) * 10;

  const pool5 = (basePool * 0.40) + rollover;
  const pool4 = basePool * 0.35;
  const pool3 = basePool * 0.25;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        logicType: logicType || "random",
        drawnNumbers,
        totalTicketsEvaluated: tickets?.length || 0,
        pools: {
          totalPool: basePool + rollover,
          basePool,
          rolloverCarriedIn: rollover,
          match5: { pool: pool5, winnersCount: match5.length, prizePerWinner: match5.length ? (pool5 / match5.length).toFixed(2) : 0 },
          match4: { pool: pool4, winnersCount: match4.length, prizePerWinner: match4.length ? (pool4 / match4.length).toFixed(2) : 0 },
          match3: { pool: pool3, winnersCount: match3.length, prizePerWinner: match3.length ? (pool3 / match3.length).toFixed(2) : 0 }
        },
        winnersPreview: { match5, match4, match3 }
      },
      "Simulation executed successfully."
    )
  );
});

export const publishDraw = asyncHandler(async (req, res) => {
  const { winningNumbers, logicType } = req.body;

  const { data: activeDraw } = await supabase
    .from("draws")
    .select("*")
    .in("status", ["upcoming", "active"])
    .limit(1)
    .maybeSingle();

  if (!activeDraw) throw new ApiError(404, "No active draw to publish.");
  if (!Array.isArray(winningNumbers) || winningNumbers.length !== 5) {
    throw new ApiError(400, "5 winning numbers required.");
  }

  const sortedNumbers = [...winningNumbers].sort((a, b) => a - b);
  const { data: tickets } = await supabase.from("tickets").select("*").eq("draw_id", activeDraw.id);

  const match5 = [], match4 = [], match3 = [];
  (tickets || []).forEach((t) => {
    const matched = (t.numbers || []).filter((n) => sortedNumbers.includes(n));
    const entry = { userId: t.user_id, userName: t.user_name, matchedNumbers: matched };
    if (matched.length === 5) match5.push(entry);
    else if (matched.length === 4) match4.push(entry);
    else if (matched.length === 3) match3.push(entry);
  });

  const { data: settingsRow } = await supabase.from("settings").select("value").eq("key", "jackpot").maybeSingle();
  const rollover = Number(settingsRow?.value?.currentJackpotRollover || activeDraw.rollover_jackpot || 0);
  const basePool = (tickets?.length || 0) * 10;

  const pool5 = (basePool * 0.40) + rollover;
  const pool4 = basePool * 0.35;
  const pool3 = basePool * 0.25;
  const nextRollover = match5.length === 0 ? pool5 : 0;

  await supabase.from("settings").upsert({
    key: "jackpot",
    value: { currentJackpotRollover: nextRollover },
    updated_at: new Date().toISOString()
  });

  await supabase
    .from("draws")
    .update({
      status: "published",
      winning_numbers: sortedNumbers,
      logic_type: logicType || "random",
      total_subscribers_at_draw: tickets?.length || 0,
      total_pool: basePool + rollover,
      published_at: new Date().toISOString()
    })
    .eq("id", activeDraw.id);

  const createdWinners = [];
  const tiers = [
    { key: "match5", label: "5-Number Match", pool: pool5, list: match5 },
    { key: "match4", label: "4-Number Match", pool: pool4, list: match4 },
    { key: "match3", label: "3-Number Match", pool: pool3, list: match3 }
  ];

  for (const { key, label, pool, list } of tiers) {
    if (!list.length) continue;
    const share = pool / list.length;

    for (const w of list) {
      const { data: user } = await supabase.from("users").select("email, charity").eq("id", w.userId).maybeSingle();
      const pct = user?.charity?.percentage || 10;
      const charityAmt = Number(((share * pct) / 100).toFixed(2));
      const net = Number((share - charityAmt).toFixed(2));

      const winnerRecord = {
        id: `win_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        draw_id: activeDraw.id,
        draw_number: activeDraw.draw_number,
        user_id: w.userId,
        user_name: w.userName,
        user_email: user?.email || "",
        tier: key,
        tier_label: label,
        matched_numbers: w.matchedNumbers,
        prize_amount: Number(share.toFixed(2)),
        charity_contribution_amount: charityAmt,
        net_payout_amount: net,
        verification_status: "pending_verification",
        payout_status: "pending",
        won_at: new Date().toISOString()
      };

      await supabase.from("winners").insert(winnerRecord);
      createdWinners.push({
        ...winnerRecord,
        userId: winnerRecord.user_id,
        userName: winnerRecord.user_name,
        prizeAmount: winnerRecord.prize_amount,
        netPayoutAmount: winnerRecord.net_payout_amount
      });
    }
  }

  // Create next month's active draw
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextYear = nextMonth.getFullYear();
  const nextMonthStr = String(nextMonth.getMonth() + 1).padStart(2, "0");

  const newDraw = {
    id: `draw_${Date.now()}`,
    draw_number: `DRAW-${nextYear}-${nextMonthStr}`,
    title: `${nextMonth.toLocaleString("en-US", { month: "long" })} ${nextYear} Impact Draw`,
    status: "upcoming",
    draw_date: new Date(nextYear, nextMonth.getMonth() + 1, 0, 20, 0, 0).toISOString(),
    logic_type: "algorithmic",
    base_pool: 0,
    rollover_jackpot: nextRollover,
    total_pool: nextRollover
  };

  await supabase.from("draws").insert(newDraw);

  return res.status(200).json(
    new ApiResponse(200, { winners: createdWinners, nextActiveDraw: newDraw }, "Draw published successfully.")
  );
});



export const adminCreateCharity = asyncHandler(async (req, res) => {
  const { name, tagline, category, description, logo, bannerImage, featured } = req.body;
  if (!name || !tagline || !category) {
    throw new ApiError(400, "Name, tagline, and category are required.");
  }

  const row = {
    id: `charity_${Date.now()}`,
    name,
    tagline,
    category,
    description: description || "",
    logo: logo || "",
    banner_image: bannerImage || "",
    featured: Boolean(featured),
    total_raised: 0,
    active_supporters: 0
  };

  const { data, error } = await supabase.from("charities").insert(row).select().single();
  if (error) throw new ApiError(500, error.message);

  return res.status(201).json(new ApiResponse(201, data, "Charity created successfully."));
});

export const adminUpdateCharity = asyncHandler(async (req, res) => {
  const { charityId } = req.params;
  const updates = { ...req.body };
  if (req.body.bannerImage) {
    updates.banner_image = req.body.bannerImage;
    delete updates.bannerImage;
  }

  const { data, error } = await supabase
    .from("charities")
    .update(updates)
    .eq("id", charityId)
    .select()
    .single();

  if (error) throw new ApiError(404, "Charity not found or update failed.");
  return res.status(200).json(new ApiResponse(200, data, "Charity updated successfully."));
});

export const adminDeleteCharity = asyncHandler(async (req, res) => {
  const { charityId } = req.params;
  const { error } = await supabase.from("charities").delete().eq("id", charityId);
  if (error) throw new ApiError(404, "Charity not found or delete failed.");
  return res.status(200).json(new ApiResponse(200, {}, "Charity removed successfully."));
});


export const getAllWinners = asyncHandler(async (req, res) => {
  const { data: winners, error } = await supabase
    .from("winners")
    .select("*")
    .order("won_at", { ascending: false });

  if (error) throw new ApiError(500, error.message);

  const mapped = (winners || []).map((w) => ({
    ...w,
    userId: w.user_id,
    userName: w.user_name,
    userEmail: w.user_email,
    drawNumber: w.draw_number,
    tierLabel: w.tier_label,
    prizeAmount: Number(w.prize_amount || 0),
    charityContributionAmount: Number(w.charity_contribution_amount || 0),
    netPayoutAmount: Number(w.net_payout_amount || 0),
    verificationStatus: w.verification_status,
    proofImage: w.proof_image,
    proofSubmittedAt: w.proof_submitted_at,
    adminNotes: w.admin_notes,
    payoutStatus: w.payout_status
  }));

  return res.status(200).json(new ApiResponse(200, mapped, "Winners retrieved."));
});

export const reviewWinnerProof = asyncHandler(async (req, res) => {
  const { winnerId } = req.params;
  const { action, notes } = req.body;

  if (action !== "approve" && action !== "reject") {
    throw new ApiError(400, "Action must be 'approve' or 'reject'.");
  }

  const { data, error } = await supabase
    .from("winners")
    .update({
      verification_status: action === "approve" ? "approved" : "rejected",
      admin_notes: notes || (action === "approve" ? "Scorecard proof approved." : "Proof rejected.")
    })
    .eq("id", winnerId)
    .select()
    .single();

  if (error) throw new ApiError(404, "Winner record not found.");
  return res.status(200).json(new ApiResponse(200, data, `Winner proof ${action}d.`));
});

export const markWinnerPayoutPaid = asyncHandler(async (req, res) => {
  const { winnerId } = req.params;
  const { transactionRef } = req.body;

  const { data, error } = await supabase
    .from("winners")
    .update({
      payout_status: "paid",
      payout_transaction_id: transactionRef || `PAY_${Date.now()}`,
      paid_at: new Date().toISOString()
    })
    .eq("id", winnerId)
    .select()
    .single();

  if (error) throw new ApiError(404, "Winner record not found.");
  return res.status(200).json(new ApiResponse(200, data, "Winner payout marked as paid."));
});


export const getAdminReports = asyncHandler(async (req, res) => {
  const [{ data: users }, { data: charities }, { data: draws }, { data: winners }, { data: donations }, { data: settings }] =
    await Promise.all([
      supabase.from("users").select("subscription, charity"),
      supabase.from("charities").select("id, name, category, total_raised"),
      supabase.from("draws").select("status"),
      supabase.from("winners").select("payout_status, net_payout_amount"),
      supabase.from("donations").select("amount"),
      supabase.from("settings").select("value").eq("key", "jackpot").maybeSingle()
    ]);

  const activeSubscribers = (users || []).filter((u) => u.subscription?.status === "active").length;
  const paidWinners = (winners || []).filter((w) => w.payout_status === "paid");
  const pendingWinners = (winners || []).filter((w) => w.payout_status === "pending");

  const totalPrizePaid = paidWinners.reduce((sum, w) => sum + (Number(w.net_payout_amount) || 0), 0);
  const totalPendingPayout = pendingWinners.reduce((sum, w) => sum + (Number(w.net_payout_amount) || 0), 0);
  const totalCharityRaised = (charities || []).reduce((sum, c) => sum + (Number(c.total_raised) || 0), 0);
  const directDonationsTotal = (donations || []).reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const charityBreakdown = (charities || []).map((c) => ({
    id: c.id,
    name: c.name,
    category: c.category,
    totalRaised: Number(c.total_raised || 0),
    supportersCount: (users || []).filter((u) => u.charity?.charityId === c.id).length
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        kpis: {
          totalUsers: users?.length || 0,
          activeSubscribers,
          currentJackpotRollover: Number(settings?.value?.currentJackpotRollover || 0),
          totalPrizePaid,
          totalPendingPayout,
          totalCharityRaisedAll: totalCharityRaised,
          directDonationsTotal,
          drawsCompleted: (draws || []).filter((d) => d.status === "published").length
        },
        charityBreakdown,
        recentDraws: [],
        recentWinners: []
      },
      "Reports generated successfully."
    )
  );
});
