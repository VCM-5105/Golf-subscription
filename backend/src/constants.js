export const DB_NAME = "golf_platform_db";

export const USER_ROLES = {
  PUBLIC: "public",
  SUBSCRIBER: "subscriber",
  ADMIN: "admin",
};

export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: "plan_monthly",
    name: "Monthly Membership",
    price: 19,
    interval: "month",
    features: [
      "Monthly 3-tier draw participation",
      "Stableford performance tracking (5 scores)",
      "Direct minimum 10% to your chosen charity",
      "Verified winner prize eligibility"
    ]
  },
  YEARLY: {
    id: "plan_yearly",
    name: "Annual Membership",
    price: 190,
    interval: "year",
    discountLabel: "Save 17% (2 Months Free)",
    features: [
      "12 automatic monthly draw entries",
      "Priority verification & payout processing",
      "Continuous charity funding stream",
      "Full access to advanced Stableford stats"
    ]
  }
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  LAPSED: "lapsed",
  CANCELLED: "cancelled"
};

export const SCORE_CONSTRAINTS = {
  MAX_RETAINED_SCORES: 5,
  MIN_STABLEFORD: 1,
  MAX_STABLEFORD: 45
};

export const DRAW_RULES = {
  TIERS: {
    MATCH_5: {
      name: "5-Number Match",
      poolShare: 0.40,
      rollover: true,
      label: "Grand Prize (Jackpot Rollover)"
    },
    MATCH_4: {
      name: "4-Number Match",
      poolShare: 0.35,
      rollover: false,
      label: "Second Tier Pool"
    },
    MATCH_3: {
      name: "3-Number Match",
      poolShare: 0.25,
      rollover: false,
      label: "Third Tier Pool"
    }
  },
  MODES: {
    RANDOM: "random",
    ALGORITHMIC: "algorithmic"
  }
};

export const CHARITY_CONFIG = {
  MIN_CONTRIBUTION_PERCENT: 10,
  DEFAULT_CONTRIBUTION_PERCENT: 10,
  MAX_CONTRIBUTION_PERCENT: 75
};

export const WINNER_STATUS = {
  PENDING_VERIFICATION: "pending_verification",
  APPROVED: "approved",
  REJECTED: "rejected"
};

export const PAYOUT_STATUS = {
  PENDING: "pending",
  PAID: "paid"
};
