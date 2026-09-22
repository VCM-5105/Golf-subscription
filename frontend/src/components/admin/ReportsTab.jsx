import React from "react";
import { Users, DollarSign, Heart, Award, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Badge } from "../common/Badge.jsx";

export const ReportsTab = ({ reports }) => {
  const kpis = reports?.kpis || {};
  const charityBreakdown = reports?.charityBreakdown || [];
  const recentDraws = reports?.recentDraws || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-editorial text-2xl font-bold text-[#181918]">
          05 · Reports & Real-Time Analytics
        </h3>
        <p className="text-xs text-[#6B726C] font-mono-code mt-0.5">
          Platform-wide financial health, charity impact totals, and draw metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-[#DDD7CD] rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code uppercase text-[#8E948F]">Subscribers</span>
            <Users className="w-4 h-4 text-[#2D483A]" />
          </div>
          <div className="font-editorial text-3xl font-bold text-[#181918] mt-2">
            {kpis.activeSubscribers || 0}
          </div>
          <span className="text-[11px] font-mono-code text-[#737A74] mt-1 block">
            {kpis.totalUsers || 0} registered accounts
          </span>
        </div>

        <div className="p-5 bg-white border border-[#DDD7CD] rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code uppercase text-[#8E948F]">Jackpot Rollover</span>
            <Award className="w-4 h-4 text-[#C28B38]" />
          </div>
          <div className="font-editorial text-3xl font-bold text-[#181918] mt-2">
            ${(kpis.currentJackpotRollover || 0).toLocaleString()}
          </div>
          <span className="text-[11px] font-mono-code text-[#C28B38] mt-1 block">
            Carried to next 5-match tier
          </span>
        </div>

        <div className="p-5 bg-white border border-[#DDD7CD] rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code uppercase text-[#8E948F]">Total Disbursed</span>
            <DollarSign className="w-4 h-4 text-[#2D483A]" />
          </div>
          <div className="font-editorial text-3xl font-bold text-[#181918] mt-2">
            ${Math.round(kpis.totalPrizePaid || 0).toLocaleString()}
          </div>
          <span className="text-[11px] font-mono-code text-[#575C57] mt-1 block">
            ${Math.round(kpis.totalPendingPayout || 0).toLocaleString()} pending verification
          </span>
        </div>

        <div className="p-5 bg-white border border-[#DDD7CD] rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code uppercase text-[#8E948F]">Charity Raised</span>
            <Heart className="w-4 h-4 text-[#2D483A]" />
          </div>
          <div className="font-editorial text-3xl font-bold text-[#2D483A] mt-2">
            ${(kpis.totalCharityRaisedAll || 0).toLocaleString()}
          </div>
          <span className="text-[11px] font-mono-code text-[#737A74] mt-1 block">
            +${(kpis.directDonationsTotal || 0).toLocaleString()} direct gifts
          </span>
        </div>
      </div>

      {/* Philanthropic Breakdown Table */}
      <div className="p-6 bg-white border border-[#DDD7CD] rounded-xl shadow-2xs">
        <h4 className="font-editorial text-lg font-bold text-[#181918] mb-4">
          Charity Contribution Distribution by Cause
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F3EB] border-b border-[#DDD7CD] font-mono-code uppercase text-[#787D78]">
              <tr>
                <th className="py-2.5 px-3">Organization</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Direct Supporters</th>
                <th className="py-2.5 px-3 text-right">Cumulative Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEBE3]">
              {charityBreakdown.map((ch) => (
                <tr key={ch.id}>
                  <td className="py-3 px-3 font-semibold text-[#181918]">{ch.name}</td>
                  <td className="py-3 px-3">
                    <Badge variant="outline">{ch.category}</Badge>
                  </td>
                  <td className="py-3 px-3 font-mono-code text-[#575C57]">
                    {ch.supportersCount} active subscribers
                  </td>
                  <td className="py-3 px-3 font-mono-code font-bold text-right text-[#2D483A]">
                    ${(ch.totalRaised || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Draw Analytics */}
      <div className="p-6 bg-white border border-[#DDD7CD] rounded-xl shadow-2xs">
        <h4 className="font-editorial text-lg font-bold text-[#181918] mb-4">
          Completed Monthly Draw Cadence
        </h4>
        <div className="divide-y divide-[#EFEBE3]">
          {recentDraws.map((d) => (
            <div key={d.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#181918]">{d.title}</span>
                  <Badge variant={d.status === "published" ? "active" : "pending"}>
                    {d.status}
                  </Badge>
                </div>
                <div className="text-xs font-mono-code text-[#737A74] mt-0.5">
                  Draw date: {d.drawDate?.split("T")[0]} • Algorithm: {d.logicType || "random"}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono-code">
                {d.winningNumbers && (
                  <div className="flex items-center gap-1">
                    <span className="text-[#8E948F]">Drawn:</span>
                    <span className="font-bold text-[#181918]">[{d.winningNumbers.join(", ")}]</span>
                  </div>
                )}
                <div>
                  <span className="text-[#8E948F]">Pool:</span>
                  <span className="font-bold text-[#2D483A]"> ${(d.totalPool || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
