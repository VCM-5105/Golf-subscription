import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { supabase } from "../db/index.js";
import { SUBSCRIPTION_PLANS, SUBSCRIPTION_STATUS } from "../constants.js";
import { syncUserDrawTicket } from "../utils/ticketSync.js";

export const getPlans = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, Object.values(SUBSCRIPTION_PLANS), "Subscription plans retrieved.")
  );
});

export const subscribe = asyncHandler(async (req, res) => {
  const { planId, paymentMethod } = req.body;

  if (!planId) {
    throw new ApiError(400, "Plan ID is required.");
  }

  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("*")
    .eq("id", req.user.id)
    .maybeSingle();

  if (userErr || !user) {
    throw new ApiError(404, "User not found.");
  }

  const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.id === planId);
  if (!plan) {
    throw new ApiError(404, "Selected subscription plan not found.");
  }

  const now = new Date();
  const renewalDate = new Date(now);
  if (plan.interval === "year") {
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  } else {
    renewalDate.setMonth(renewalDate.getMonth() + 1);
  }

  const updatedSubscription = {
    status: SUBSCRIPTION_STATUS.ACTIVE,
    planId: plan.id,
    planName: plan.name,
    startedAt: now.toISOString(),
    renewalDate: renewalDate.toISOString(),
    price: plan.price,
    paymentMethod: paymentMethod || "Credit Card"
  };

  const { data: updatedUser, error: updateErr } = await supabase
    .from("users")
    .update({
      subscription: updatedSubscription,
      updated_at: now.toISOString()
    })
    .eq("id", req.user.id)
    .select()
    .single();

  if (updateErr || !updatedUser) {
    throw new ApiError(500, "Failed to update subscription in database.");
  }

  // Automatically ensure user's 5 scores (if entered) generate an active draw ticket
  await syncUserDrawTicket(req.user.id);

  // Update active draw pool projection
  const { data: activeDraw } = await supabase
    .from("draws")
    .select("*")
    .in("status", ["upcoming", "active"])
    .order("draw_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (activeDraw) {
    const { data: allUsers } = await supabase.from("users").select("subscription");
    const totalSubscribers = (allUsers || []).filter(
      (u) => u.subscription?.status === SUBSCRIPTION_STATUS.ACTIVE
    ).length;

    await supabase
      .from("draws")
      .update({
        total_subscribers_at_draw: totalSubscribers,
        total_pool: (totalSubscribers * 10) + (Number(activeDraw.rollover_jackpot) || 0)
      })
      .eq("id", activeDraw.id);
  }

  const { password, ...userSafe } = updatedUser;

  return res.status(200).json(
    new ApiResponse(200, { subscription: updatedSubscription, user: userSafe }, "Subscription activated successfully.")
  );
});

export const cancelSubscription = asyncHandler(async (req, res) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", req.user.id)
    .maybeSingle();

  if (error || !user || !user.subscription || user.subscription.status !== SUBSCRIPTION_STATUS.ACTIVE) {
    throw new ApiError(400, "No active subscription to cancel.");
  }

  const updatedSubscription = {
    ...user.subscription,
    status: SUBSCRIPTION_STATUS.CANCELLED,
    cancelledAt: new Date().toISOString()
  };

  const { data: updatedUser, error: updateErr } = await supabase
    .from("users")
    .update({
      subscription: updatedSubscription,
      updated_at: new Date().toISOString()
    })
    .eq("id", req.user.id)
    .select()
    .single();

  if (updateErr || !updatedUser) {
    throw new ApiError(500, "Failed to cancel subscription.");
  }

  await syncUserDrawTicket(req.user.id);

  const { password, ...userSafe } = updatedUser;

  return res.status(200).json(
    new ApiResponse(200, { subscription: updatedSubscription, user: userSafe }, "Subscription cancelled. Access remains until the current billing period expires.")
  );
});

export const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const { data: user } = await supabase
    .from("users")
    .select("subscription")
    .eq("id", req.user.id)
    .maybeSingle();

  return res.status(200).json(
    new ApiResponse(200, user?.subscription || { status: SUBSCRIPTION_STATUS.INACTIVE }, "Subscription status retrieved.")
  );
});
