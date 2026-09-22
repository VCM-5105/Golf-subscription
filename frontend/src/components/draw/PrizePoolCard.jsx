import React from "react";
import { Sparkles, ArrowUpRight, Shield, Layers } from "lucide-react";
import { Badge } from "../common/Badge.jsx";

export const PrizePoolCard = ({ drawData }) => {
  const {
    totalPool = 0,
    basePool = 0,
    rolloverJackpot = 0,
    activeSubscribersCount = 0,
    tiers = {}
  } = drawData || {};

  const tierItems = [
    {
      match: "5-Number Match",
      share: "40%",
      rollover: true,
      rolloverLabel: "Yes — Jackpot Rollover",
      poolAmount: tiers.match5?.totalTierPool ?? (basePool * 0.4 + rolloverJackpot),
      details: "Carries forward automatically to next month if unclaimed."
    },
    {
      match: "4-Number Match",
      share: "35%",
      rollover: false,
      rolloverLabel: "No (Split among tier winners)",
      poolAmount: tiers.match4?.totalTierPool ?? (basePool * 0.35),
      details: "Distributed equally across all 4-number match tickets."
    },
    {
      match: "3-Number Match",
      share: "25%",
      rollover: false,
      rolloverLabel: "No (Split among tier winners)",
      poolAmount: tiers.match3?.totalTierPool ?? (basePool * 0.25),
      details: "Distributed equally across all 3-number match tickets."
    }
  ];

  return (
    <div className="border border-[#DDD7CD] rounded-2xl bg-white overflow-hidden shadow-sm">
      {/* Editorial Header */}
      <div className="p-6 md:p-8 bg-[#F6F3EB] border-b border-[#DDD7CD]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase text-[#6B726C] tracking-wider mb-2">
              <span>Prize Pool Logic</span>
              <span>•</span>
              <span>Pre-Defined & Enforced</span>
            </div>
            <h3 className="font-editorial text-3xl font-semibold text-[#181918]">
              Monthly Draw Allocation
            </h3>
            <p className="text-sm text-[#575C57] mt-1.5 max-w-xl">
              A fixed portion of each subscription funds the monthly reward pool. Auto-calculated based on {activeSubscribersCount.toLocaleString()} active subscribers.
            </p>
          </div>

          {/* Grand Pool Display */}
          <div className="bg-[#FAF8F5] border border-[#DDD7CD] px-6 py-4 rounded-xl shrink-0">
            <span className="text-xs font-mono-code uppercase text-[#787D78] block">
              Projected Total Pool
            </span>
            <div className="font-editorial text-3xl md:text-4xl font-bold text-[#181918] mt-0.5">
              ${Number(totalPool || 0).toLocaleString()}
            </div>
            {rolloverJackpot > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono-code text-[#2D483A] mt-1 font-medium">
                <Sparkles className="w-3 h-3" />
                Includes ${rolloverJackpot.toLocaleString()} rollover jackpot
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3 Tier Table Representation */}
      <div className="divide-y divide-[#EFEBE3]">
        {tierItems.map((item, idx) => (
          <div
            key={idx}
            className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#F5F2EB] border border-[#DDD7CD] flex items-center justify-center font-mono-code font-bold text-sm text-[#2D483A] shrink-0">
                0{idx + 1}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="text-base font-semibold text-[#181918]">
                    {item.match}
                  </h4>
                  <Badge variant={item.rollover ? "active" : "default"}>
                    {item.share} Pool Share
                  </Badge>
                  {item.rollover && (
                    <Badge variant="pending">Jackpot Rollover</Badge>
                  )}
                </div>
                <p className="text-xs text-[#6B726C] mt-1">
                  {item.details}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 pl-14 md:pl-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#EFEBE3]">
              <div className="text-left md:text-right">
                <span className="text-[11px] font-mono-code text-[#787D78] block uppercase">
                  Projected Tier Value
                </span>
                <span className="text-xl font-bold font-editorial text-[#181918]">
                  ${Math.round(item.poolAmount).toLocaleString()}
                </span>
              </div>
              <div className="text-left md:text-right">
                <span className="text-[11px] font-mono-code text-[#787D78] block uppercase">
                  Rollover Rule
                </span>
                <span className="text-xs font-mono-code text-[#4E534E]">
                  {item.rolloverLabel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
