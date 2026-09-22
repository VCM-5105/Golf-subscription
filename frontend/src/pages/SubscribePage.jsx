import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { subscriptionService } from "../services/subscriptionService.js";
import { useToast } from "../context/ToastContext.jsx";
import { Check, ShieldCheck, Heart, Sparkles, CreditCard, Lock } from "lucide-react";
import { Badge } from "../components/common/Badge.jsx";

export const SubscribePage = ({ selectedCharity, setCurrentView }) => {
  const { user, refreshUser, hasActiveSubscription } = useAuth();
  const toast = useToast();

  const [selectedPlan, setSelectedPlan] = useState("plan_monthly");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: "plan_monthly",
      name: "Monthly Membership",
      price: 19,
      interval: "month",
      billingText: "Billed monthly. Cancel anytime.",
      features: [
        "Monthly 3-tier draw participation (5/4/3-match)",
        "Verified Stableford score tracking (last 5 rounds)",
        "Minimum 10% directed to your chosen charity",
        "Full eligibility for 5-match jackpot rollover",
        "Winner proof verification portal"
      ]
    },
    {
      id: "plan_yearly",
      name: "Annual Membership",
      price: 190,
      interval: "year",
      discountBadge: "Save 17% (2 Months Free)",
      billingText: "Billed annually at $190/year.",
      features: [
        "12 consecutive monthly draw entries guaranteed",
        "Verified Stableford score tracking (last 5 rounds)",
        "Minimum 10% continuous charity funding stream",
        "Priority winner verification & payout review",
        "Exclusive end-of-season charity recognition"
      ]
    }
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please sign in or create an account to initiate subscription.");
      setCurrentView("login");
      return;
    }

    setLoading(true);
    try {
      await subscriptionService.subscribe(selectedPlan, `Card ending in ${cardNumber.slice(-4)}`);
      await refreshUser();
      toast.success("Membership successfully activated! Welcome to The Platform.");
      setCurrentView("dashboard");
    } catch (err) {
      toast.error(err.message || "Subscription activation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4F1EA] border border-[#DDD7CD] rounded-full text-xs font-mono-code text-[#4E534E]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2D483A]" />
          <span>MEMBERSHIP TIERS & ACCESS</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-[#181918]">
          Subscribe. <span className="italic font-serif font-normal text-[#2D483A]">Score.</span>
        </h1>

        <p className="text-sm sm:text-base text-[#575C57] font-light">
          Simple, transparent pricing. A fixed portion of every membership funds vetted philanthropic partners and powers the verified monthly prize pool.
        </p>
      </div>

      {/* Pricing Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((p) => {
          const isSelected = selectedPlan === p.id;
          return (
            <div
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              className={`p-8 rounded-2xl border cursor-pointer transition-all duration-300 relative flex flex-col justify-between ${
                isSelected
                  ? "border-[#2D483A] bg-white ring-2 ring-[#2D483A]/20 shadow-md"
                  : "border-[#DDD7CD] bg-[#FAF8F5] hover:border-[#BDB5A7]"
              }`}
            >
              {p.discountBadge && (
                <div className="absolute -top-3 right-6">
                  <Badge variant="active" className="bg-[#2D483A] text-white">
                    {p.discountBadge}
                  </Badge>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-2xl font-bold text-[#181918]">
                    {p.name}
                  </h3>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? "border-[#2D483A] bg-[#2D483A] text-white" : "border-[#DDD7CD]"
                  }`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>

                <div className="mt-4 mb-2 flex items-baseline gap-1">
                  <span className="font-editorial text-4xl sm:text-5xl font-bold text-[#181918]">
                    ${p.price}
                  </span>
                  <span className="text-xs font-mono-code text-[#737A74]">
                    / {p.interval}
                  </span>
                </div>
                <p className="text-xs font-mono-code text-[#8E948F] mb-6">
                  {p.billingText}
                </p>

                <div className="space-y-3 pt-6 border-t border-[#EFEBE3]">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#4E534E]">
                      <Check className="w-4 h-4 text-[#2D483A] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  type="button"
                  className={`w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isSelected
                      ? "bg-[#2D483A] text-white"
                      : "bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A]"
                  }`}
                >
                  {isSelected ? "Selected Tier" : "Choose Tier"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PCI-Compliant Simulated Checkout Form */}
      <div className="max-w-xl mx-auto p-8 rounded-2xl bg-white border border-[#DDD7CD] shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#EFEBE3] pb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#2D483A]" />
            <span className="text-xs font-mono-code uppercase text-[#181918] font-bold">
              Secure PCI-Compliant Gateway
            </span>
          </div>
          <span className="text-[11px] font-mono-code text-[#787D78]">
            256-Bit SSL Enforced
          </span>
        </div>

        {selectedCharity && (
          <div className="p-3.5 bg-[#FAF8F5] border border-[#DDD7CD] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#2D483A]" />
              <div>
                <span className="font-semibold text-[#181918]">Beneficiary:</span>{" "}
                {selectedCharity.name}
              </div>
            </div>
            <Badge variant="outline">10% Directed</Badge>
          </div>
        )}

        <form onSubmit={handleSubscribe} className="space-y-4">
          <div>
            <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1.5">
              Card Number (Stripe Simulation)
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-[#8E948F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#D5CFC5] rounded-xl text-xs font-mono-code text-[#181918] focus:outline-none focus:border-[#2D483A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1.5">
                Expiration
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5CFC5] rounded-xl text-xs font-mono-code text-[#181918] focus:outline-none focus:border-[#2D483A]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#4E534E] mb-1.5">
                CVC / CVV
              </label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5CFC5] rounded-xl text-xs font-mono-code text-[#181918] focus:outline-none focus:border-[#2D483A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 bg-[#181918] text-[#FAF8F5] hover:bg-[#2D483A] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>
              {loading
                ? "Processing Checkout..."
                : `Activate Membership · $${selectedPlan === "plan_monthly" ? "19/mo" : "190/yr"}`}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
