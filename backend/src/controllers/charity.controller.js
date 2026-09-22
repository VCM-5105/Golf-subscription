import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { supabase } from "../db/index.js";
import { CHARITY_CONFIG } from "../constants.js";

const formatCharity = (c) => ({
  ...c,
  totalRaised: Number(c.total_raised || 0),
  activeSupporters: Number(c.active_supporters || 0),
  bannerImage: c.banner_image || "",
  upcomingEvent: c.upcoming_event || null
});

export const getAllCharities = asyncHandler(async (req, res) => {
  const { search, category, featured } = req.query;
  const { data: raw, error } = await supabase.from("charities").select("*");
  if (error) throw new ApiError(500, error.message);

  let charities = (raw || []).map(formatCharity);

  if (search) {
    const q = search.toLowerCase();
    charities = charities.filter((c) => c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
  }
  if (category && category !== "All") {
    charities = charities.filter((c) => c.category === category);
  }
  if (featured === "true") {
    charities = charities.filter((c) => c.featured);
  }

  const totalRaised = charities.reduce((sum, c) => sum + c.totalRaised, 0);
  const totalSupporters = charities.reduce((sum, c) => sum + c.activeSupporters, 0);
  const categories = Array.from(new Set((raw || []).map((c) => c.category)));

  return res.status(200).json(
    new ApiResponse(200, {
      charities,
      categories,
      totalStats: { totalRaised, totalSupporters, charitiesCount: charities.length }
    }, "Charities retrieved.")
  );
});

export const getCharityById = asyncHandler(async (req, res) => {
  const { charityId } = req.params;
  const { data: raw, error } = await supabase.from("charities").select("*").eq("id", charityId).maybeSingle();
  if (error || !raw) throw new ApiError(404, "Charity not found.");

  const { data: donations } = await supabase
    .from("donations")
    .select("*")
    .eq("charity_id", charityId)
    .order("date", { ascending: false })
    .limit(10);

  return res.status(200).json(
    new ApiResponse(200, { charity: formatCharity(raw), recentDonations: donations || [] }, "Charity details retrieved.")
  );
});

export const getSpotlightCharity = asyncHandler(async (req, res) => {
  const { data: raw } = await supabase.from("charities").select("*");
  const list = (raw || []).map(formatCharity);
  const spotlight = list.find((c) => c.featured) || list[0] || null;
  return res.status(200).json(new ApiResponse(200, spotlight, "Spotlight charity retrieved."));
});

export const makeDirectDonation = asyncHandler(async (req, res) => {
  const { charityId, amount, message, isAnonymous } = req.body;
  if (!charityId || !amount || Number(amount) <= 0) {
    throw new ApiError(400, "Charity ID and positive amount required.");
  }

  const { data: charity, error: fetchErr } = await supabase.from("charities").select("*").eq("id", charityId).maybeSingle();
  if (fetchErr || !charity) throw new ApiError(404, "Charity not found.");

  const donationAmount = Number(amount);
  const donation = {
    id: `don_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    user_id: req.user ? req.user.id : "anonymous",
    donor_name: req.user && !isAnonymous ? req.user.name : "Generous Donor",
    charity_id: charity.id,
    charity_name: charity.name,
    amount: donationAmount,
    message: message?.trim() || "Independent donation.",
    date: new Date().toISOString()
  };

  await supabase.from("donations").insert(donation);

  const newTotal = (Number(charity.total_raised) || 0) + donationAmount;
  const newSupporters = (Number(charity.active_supporters) || 0) + 1;

  await supabase.from("charities").update({ total_raised: newTotal, active_supporters: newSupporters }).eq("id", charity.id);

  return res.status(201).json(
    new ApiResponse(201, { donation, updatedCharityTotal: newTotal }, "Donation successful.")
  );
});

export const updateUserCharitySelection = asyncHandler(async (req, res) => {
  const { charityId, percentage } = req.body;
  if (!charityId) throw new ApiError(400, "Charity ID required.");

  const { data: charity } = await supabase.from("charities").select("id, name").eq("id", charityId).maybeSingle();
  if (!charity) throw new ApiError(404, "Charity does not exist.");

  const pct = Math.max(CHARITY_CONFIG.MIN_CONTRIBUTION_PERCENT, Math.min(CHARITY_CONFIG.MAX_CONTRIBUTION_PERCENT, Number(percentage) || 10));

  const charityUpdate = { charityId: charity.id, charityName: charity.name, percentage: pct };
  const { data: user, error } = await supabase
    .from("users")
    .update({ charity: charityUpdate, updated_at: new Date().toISOString() })
    .eq("id", req.user.id)
    .select()
    .single();

  if (error) throw new ApiError(500, "Failed to update charity selection.");
  return res.status(200).json(new ApiResponse(200, user.charity, "Charity preference saved."));
});
