import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { supabase } from "../db/index.js";

export const getMyWinnings = asyncHandler(async (req, res) => {
  const { data: list, error } = await supabase
    .from("winners")
    .select("*")
    .eq("user_id", req.user.id)
    .order("won_at", { ascending: false });

  if (error) throw new ApiError(500, error.message);

  const winnings = (list || []).map((w) => ({
    ...w,
    userId: w.user_id,
    userName: w.user_name,
    prizeAmount: Number(w.prize_amount || 0),
    charityContributionAmount: Number(w.charity_contribution_amount || 0),
    netPayoutAmount: Number(w.net_payout_amount || 0),
    verificationStatus: w.verification_status,
    payoutStatus: w.payout_status,
    proofImage: w.proof_image
  }));

  const totalPrizeWon = winnings.reduce((s, w) => s + w.prizeAmount, 0);
  const totalCharityDirect = winnings.reduce((s, w) => s + w.charityContributionAmount, 0);
  const totalNetPayout = winnings.reduce((s, w) => s + w.netPayoutAmount, 0);
  const totalPaidOut = winnings
    .filter((w) => w.payoutStatus === "paid")
    .reduce((s, w) => s + w.netPayoutAmount, 0);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        winnings,
        summary: {
          totalPrizeWon,
          totalCharityDirect,
          totalNetPayout,
          totalPaidOut,
          pendingCount: winnings.filter((w) => w.payoutStatus === "pending").length
        }
      },
      "User winnings retrieved."
    )
  );
});

export const submitWinnerProof = asyncHandler(async (req, res) => {
  const { winnerId } = req.params;
  const { data: winner } = await supabase.from("winners").select("*").eq("id", winnerId).maybeSingle();
  if (!winner) throw new ApiError(404, "Winning record not found.");
  if (winner.user_id !== req.user.id) throw new ApiError(403, "Unauthorized.");

  const proofUrl = req.file ? `/uploads/${req.file.filename}` : req.body.proofImageUrl;
  if (!proofUrl) throw new ApiError(400, "Proof image is required.");

  const { data: updated, error } = await supabase
    .from("winners")
    .update({
      proof_image: proofUrl,
      proof_submitted_at: new Date().toISOString(),
      verification_status: "pending_verification",
      admin_notes: "Proof submitted by player."
    })
    .eq("id", winnerId)
    .select()
    .single();

  if (error) throw new ApiError(500, "Failed to update proof.");
  return res.status(200).json(new ApiResponse(200, updated, "Score verification proof uploaded."));
});
